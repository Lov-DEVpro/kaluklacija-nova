import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Kalkulacija, KalkulacijaFormData } from '@/types/kalkulacija';
import { toast } from 'sonner';

export function useKalkulacije() {
  const [kalkulacije, setKalkulacije] = useState<Kalkulacija[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchKalkulacije = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('kalkulacije')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setKalkulacije((data || []) as Kalkulacija[]);
    } catch (error) {
      console.error('Greška pri učitavanju kalkulacija:', error);
      toast.error('Greška pri učitavanju kalkulacija');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKalkulacije();
  }, [user]);

  const createKalkulacija = async (formData: KalkulacijaFormData) => {
    if (!user) return null;

    // Izračunaj ukupne troškove za inostranstvo i BiH
    const ino_ukupno = formData.ino_broj_radnika * formData.ino_broj_dana * 
      (formData.ino_cijena_smjestaja_km + formData.ino_cijena_ishrane_km + formData.ino_terenska_dnevnica_km);
    
    const bih_ukupno = formData.bih_broj_radnika * formData.bih_broj_dana * 
      (formData.bih_cijena_smjestaja_km + formData.bih_cijena_ishrane_km + formData.bih_terenska_dnevnica_km);

    try {
      const { data, error } = await supabase
        .from('kalkulacije')
        .insert({
          ...formData,
          user_id: user.id,
          ino_ukupno_km: ino_ukupno,
          bih_ukupno_km: bih_ukupno,
          status: 'draft',
          zakljucano: false,
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchKalkulacije();
      toast.success('Kalkulacija uspješno kreirana');
      return data;
    } catch (error) {
      console.error('Greška pri kreiranju kalkulacije:', error);
      toast.error('Greška pri kreiranju kalkulacije');
      return null;
    }
  };

  const updateKalkulacija = async (id: string, formData: Partial<KalkulacijaFormData>) => {
    if (!user) return false;

    // Provjeri da li je kalkulacija zaključana
    const existing = kalkulacije.find(k => k.id === id);
    if (existing?.zakljucano) {
      toast.error('Ova kalkulacija je zaključana i ne može se uređivati');
      return false;
    }

    // Ako su prisutni podaci za inostranstvo/BiH, izračunaj ukupne troškove
    const updates: Record<string, unknown> = { ...formData };
    
    if ('ino_broj_radnika' in formData || 'ino_broj_dana' in formData) {
      if (existing) {
        const ino_radnika = formData.ino_broj_radnika ?? existing.ino_broj_radnika;
        const ino_dana = formData.ino_broj_dana ?? existing.ino_broj_dana;
        const ino_smjestaj = formData.ino_cijena_smjestaja_km ?? existing.ino_cijena_smjestaja_km;
        const ino_ishrana = formData.ino_cijena_ishrane_km ?? existing.ino_cijena_ishrane_km;
        const ino_dnevnica = formData.ino_terenska_dnevnica_km ?? existing.ino_terenska_dnevnica_km;
        
        updates.ino_ukupno_km = ino_radnika * ino_dana * (ino_smjestaj + ino_ishrana + ino_dnevnica);
      }
    }

    if ('bih_broj_radnika' in formData || 'bih_broj_dana' in formData) {
      if (existing) {
        const bih_radnika = formData.bih_broj_radnika ?? existing.bih_broj_radnika;
        const bih_dana = formData.bih_broj_dana ?? existing.bih_broj_dana;
        const bih_smjestaj = formData.bih_cijena_smjestaja_km ?? existing.bih_cijena_smjestaja_km;
        const bih_ishrana = formData.bih_cijena_ishrane_km ?? existing.bih_cijena_ishrane_km;
        const bih_dnevnica = formData.bih_terenska_dnevnica_km ?? existing.bih_terenska_dnevnica_km;
        
        updates.bih_ukupno_km = bih_radnika * bih_dana * (bih_smjestaj + bih_ishrana + bih_dnevnica);
      }
    }

    try {
      const { error } = await supabase
        .from('kalkulacije')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      await fetchKalkulacije();
      toast.success('Kalkulacija uspješno ažurirana');
      return true;
    } catch (error) {
      console.error('Greška pri ažuriranju kalkulacije:', error);
      toast.error('Greška pri ažuriranju kalkulacije');
      return false;
    }
  };

  const deleteKalkulacija = async (id: string) => {
    if (!user) return false;

    const existing = kalkulacije.find(k => k.id === id);
    if (existing?.zakljucano) {
      toast.error('Zaključana kalkulacija se ne može obrisati');
      return false;
    }

    try {
      const { error } = await supabase
        .from('kalkulacije')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      await fetchKalkulacije();
      toast.success('Kalkulacija uspješno obrisana');
      return true;
    } catch (error) {
      console.error('Greška pri brisanju kalkulacije:', error);
      toast.error('Greška pri brisanju kalkulacije');
      return false;
    }
  };

  const duplicateKalkulacija = async (id: string) => {
    if (!user) return null;

    const original = kalkulacije.find(k => k.id === id);
    if (!original) return null;

    // Pronađi najvišu verziju za ovaj objekat
    const sameObjectKalkulacije = kalkulacije.filter(k => k.objekat === original.objekat);
    const versions = sameObjectKalkulacije.map(k => {
      const match = k.verzija.match(/v(\d+)/);
      return match ? parseInt(match[1]) : 1;
    });
    const maxVersion = Math.max(...versions, 0);
    const newVersion = `v${maxVersion + 1}`;

    const { id: _, user_id: __, created_at: ___, updated_at: ____, zakljucano: _____, datum_zakljucanja: ______, status: _______, ...rest } = original;

    try {
      const { data, error } = await supabase
        .from('kalkulacije')
        .insert({
          ...rest,
          user_id: user.id,
          verzija: newVersion,
          datum_kalkulacije: new Date().toISOString().split('T')[0],
          status: 'draft',
          zakljucano: false,
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchKalkulacije();
      toast.success(`Kalkulacija duplicirana kao ${newVersion}`);
      return data;
    } catch (error) {
      console.error('Greška pri dupliciranju kalkulacije:', error);
      toast.error('Greška pri dupliciranju kalkulacije');
      return null;
    }
  };

  const lockKalkulacija = async (id: string) => {
    if (!user) return false;

    const existing = kalkulacije.find(k => k.id === id);
    if (!existing) return false;

    try {
      // Zaključaj kalkulaciju
      const { error } = await supabase
        .from('kalkulacije')
        .update({
          zakljucano: true,
          status: 'locked',
          datum_zakljucanja: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      await fetchKalkulacije();
      toast.success('Kalkulacija uspješno zaključana');
      return true;
    } catch (error) {
      console.error('Greška pri zaključavanju kalkulacije:', error);
      toast.error('Greška pri zaključavanju kalkulacije');
      return false;
    }
  };

  const unlockKalkulacija = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('kalkulacije')
        .update({
          zakljucano: false,
          status: 'active',
          datum_zakljucanja: null,
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      await fetchKalkulacije();
      toast.success('Kalkulacija uspješno otključana');
      return true;
    } catch (error) {
      console.error('Greška pri otključavanju kalkulacije:', error);
      toast.error('Greška pri otključavanju kalkulacije');
      return false;
    }
  };

  return {
    kalkulacije,
    loading,
    fetchKalkulacije,
    createKalkulacija,
    updateKalkulacija,
    deleteKalkulacija,
    duplicateKalkulacija,
    lockKalkulacija,
    unlockKalkulacija,
  };
}
