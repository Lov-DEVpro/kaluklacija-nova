import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ElementKalkulacije, TipElementa, ParametarElementa } from '@/types/kalkulacija';
import { toast } from 'sonner';

export function useElementi(kalkulacijaId: string | undefined) {
  const [elementi, setElementi] = useState<ElementKalkulacije[]>([]);
  const [tipoviElemenata, setTipoviElemenata] = useState<TipElementa[]>([]);
  const [parametri, setParametri] = useState<ParametarElementa[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchElementi = async () => {
    if (!user || !kalkulacijaId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('element_kalkulacije')
        .select('*')
        .eq('kalkulacija_id', kalkulacijaId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setElementi((data || []) as ElementKalkulacije[]);
    } catch (error) {
      console.error('Greška pri učitavanju elemenata:', error);
      toast.error('Greška pri učitavanju elemenata');
    } finally {
      setLoading(false);
    }
  };

  const fetchTipoviElemenata = async () => {
    try {
      const { data, error } = await supabase
        .from('tip_elementa')
        .select('*')
        .order('redoslijed', { ascending: true });

      if (error) throw error;
      setTipoviElemenata((data || []) as TipElementa[]);
    } catch (error) {
      console.error('Greška pri učitavanju tipova elemenata:', error);
    }
  };

  const fetchParametri = async () => {
    try {
      const { data, error } = await supabase
        .from('parametar_elementa')
        .select('*');

      if (error) throw error;
      setParametri((data || []) as ParametarElementa[]);
    } catch (error) {
      console.error('Greška pri učitavanju parametara:', error);
    }
  };

  useEffect(() => {
    fetchElementi();
    fetchTipoviElemenata();
    fetchParametri();
  }, [user, kalkulacijaId]);

  const createElementi = async (element: Omit<ElementKalkulacije, 'id' | 'created_at'>) => {
    if (!user || !kalkulacijaId) return null;

    try {
      const { data, error } = await supabase
        .from('element_kalkulacije')
        .insert({
          ...element,
          kalkulacija_id: kalkulacijaId,
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchElementi();
      toast.success('Element uspješno dodan');
      return data;
    } catch (error) {
      console.error('Greška pri kreiranju elementa:', error);
      toast.error('Greška pri kreiranju elementa');
      return null;
    }
  };

  const updateElement = async (id: string, updates: Partial<ElementKalkulacije>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('element_kalkulacije')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      await fetchElementi();
      toast.success('Element uspješno ažuriran');
      return true;
    } catch (error) {
      console.error('Greška pri ažuriranju elementa:', error);
      toast.error('Greška pri ažuriranju elementa');
      return false;
    }
  };

  const deleteElement = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('element_kalkulacije')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchElementi();
      toast.success('Element uspješno obrisan');
      return true;
    } catch (error) {
      console.error('Greška pri brisanju elementa:', error);
      toast.error('Greška pri brisanju elementa');
      return false;
    }
  };

  // Izračunaj ukupne troškove za sve elemente
  const ukupnoElementi = elementi.reduce((acc, el) => ({
    beton_m3: acc.beton_m3 + (el.beton_m3 || 0),
    armatura_kg: acc.armatura_kg + (el.armatura_kg || 0),
    kablovi_kg: acc.kablovi_kg + (el.kablovi_kg || 0),
    cijena_materijala_km: acc.cijena_materijala_km + (el.cijena_materijala_km || 0),
    cijena_rada_km: acc.cijena_rada_km + (el.cijena_rada_km || 0),
    ukupna_cijena_km: acc.ukupna_cijena_km + (el.ukupna_cijena_km || 0),
  }), {
    beton_m3: 0,
    armatura_kg: 0,
    kablovi_kg: 0,
    cijena_materijala_km: 0,
    cijena_rada_km: 0,
    ukupna_cijena_km: 0,
  });

  return {
    elementi,
    tipoviElemenata,
    parametri,
    loading,
    ukupnoElementi,
    fetchElementi,
    createElementi,
    updateElement,
    deleteElement,
  };
}
