import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { TransportKalkulacije } from '@/types/kalkulacija';
import { toast } from 'sonner';

export function useTransport(kalkulacijaId: string | undefined) {
  const [transport, setTransport] = useState<TransportKalkulacije[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTransport = async () => {
    if (!user || !kalkulacijaId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('transport_kalkulacije')
        .select('*')
        .eq('kalkulacija_id', kalkulacijaId)
        .order('tip_ture', { ascending: true });

      if (error) throw error;
      setTransport((data || []) as TransportKalkulacije[]);
    } catch (error) {
      console.error('Greška pri učitavanju transporta:', error);
      toast.error('Greška pri učitavanju transporta');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransport();
  }, [user, kalkulacijaId]);

  const upsertTransport = async (tipTure: 'G' | 'VG', data: Partial<TransportKalkulacije>) => {
    if (!user || !kalkulacijaId) return null;

    const existing = transport.find(t => t.tip_ture === tipTure);
    
    // Izračunaj ukupnu cijenu
    const udaljenost = data.udaljenost_km || existing?.udaljenost_km || 0;
    const cijenaPom3 = data.cijena_po_m3 || existing?.cijena_po_m3 || 0;
    const brojTura = data.broj_tura || existing?.broj_tura || 0;
    const ukupnaCijena = cijenaPom3 * brojTura;

    try {
      if (existing) {
        const { error } = await supabase
          .from('transport_kalkulacije')
          .update({
            ...data,
            ukupna_cijena_km: ukupnaCijena,
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('transport_kalkulacije')
          .insert({
            kalkulacija_id: kalkulacijaId,
            tip_ture: tipTure,
            udaljenost_km: udaljenost,
            cijena_po_m3: cijenaPom3,
            broj_tura: brojTura,
            ukupna_cijena_km: ukupnaCijena,
          });

        if (error) throw error;
      }
      
      await fetchTransport();
      return true;
    } catch (error) {
      console.error('Greška pri spremanju transporta:', error);
      toast.error('Greška pri spremanju transporta');
      return null;
    }
  };

  const calculateTransportCosts = (udaljenost: number, ukupnoBetona: number) => {
    // G tura - gabaritna
    const gTuraKmPoKm = 2.00; // KM/km vlastita tura
    const gTuraCijenaPoKm = udaljenost * 2 * gTuraKmPoKm;
    const gTuraM3PoTuri = 8;
    const gTuraBrojTura = Math.ceil(ukupnoBetona / gTuraM3PoTuri);
    const gTuraCijenaPom3 = gTuraCijenaPoKm / gTuraM3PoTuri;
    const gTuraUkupno = gTuraCijenaPom3 * gTuraBrojTura;

    // VG tura - vangabaritna
    const vgTuraKmPoKm = 4.00; // KM/km vlastita tura
    const vgTuraCijenaPoKm = udaljenost * 2 * vgTuraKmPoKm;
    const vgTuraM3PoTuri = 9;
    const vgTuraBrojTura = Math.ceil(ukupnoBetona * 0.15 / vgTuraM3PoTuri); // 15% za VG
    const vgTuraCijenaPom3 = vgTuraCijenaPoKm / vgTuraM3PoTuri;
    const vgTuraUkupno = vgTuraCijenaPom3 * vgTuraBrojTura;

    return {
      g: {
        udaljenost_km: udaljenost,
        cijena_po_m3: gTuraCijenaPom3,
        broj_tura: gTuraBrojTura,
        ukupna_cijena_km: gTuraUkupno,
      },
      vg: {
        udaljenost_km: udaljenost,
        cijena_po_m3: vgTuraCijenaPom3,
        broj_tura: vgTuraBrojTura,
        ukupna_cijena_km: vgTuraUkupno,
      },
    };
  };

  const gTura = transport.find(t => t.tip_ture === 'G');
  const vgTura = transport.find(t => t.tip_ture === 'VG');
  const ukupnoTransport = (gTura?.ukupna_cijena_km || 0) + (vgTura?.ukupna_cijena_km || 0);

  return {
    transport,
    gTura,
    vgTura,
    ukupnoTransport,
    loading,
    fetchTransport,
    upsertTransport,
    calculateTransportCosts,
  };
}
