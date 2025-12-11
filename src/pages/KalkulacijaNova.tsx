import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useKalkulacije } from '@/hooks/useKalkulacije';
import { KalkulacijaFormData } from '@/types/kalkulacija';
import { ArrowLeft, ArrowRight, Save, Printer, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const defaultFormData: KalkulacijaFormData = {
  datum_kalkulacije: new Date().toISOString().split('T')[0],
  verzija: 'v1',
  drzava: 'BiH',
  objekat: '',
  mjesto_gradnje: '',
  udaljenost_km: 0,
  povrsina_objekta_m2: 0,
  tlocrt_objekta_m2: 0,
  ponuda: 'NE',
  
  rad_proiz_armiraci_km_kg: 0.35,
  rad_proiz_kalupari_km_m3: 35,
  rad_proiz_betonirci_km_m3: 25,
  rad_proiz_sanacija_km_m3: 15,
  
  ind_administracija: 5,
  ind_tehnicka_priprema: 3,
  ind_biro: 2,
  ind_prodaja: 3,
  ind_elektricna_energija: 8,
  ind_odrzavanje_fabrike: 4,
  ind_amortizacija: 10,
  
  rad_transport_km_m3: 45,
  
  rad_mont_montazna_km_m3: 65,
  rad_mont_suplje_ploce_km_m2: 8,
  mat_mont_km_m3: 25,
  
  rad_static_km_m3: 15,
  rad_static_suplje_km_m2: 2,
  
  ino_broj_radnika: 0,
  ino_broj_dana: 0,
  ino_cijena_smjestaja_km: 30,
  ino_cijena_ishrane_km: 25,
  ino_terenska_dnevnica_km: 20,
  
  bih_broj_radnika: 0,
  bih_broj_dana: 0,
  bih_cijena_smjestaja_km: 20,
  bih_cijena_ishrane_km: 15,
  bih_terenska_dnevnica_km: 10,
};

export default function KalkulacijaNova() {
  const navigate = useNavigate();
  const { createKalkulacija } = useKalkulacije();
  const [formData, setFormData] = useState<KalkulacijaFormData>(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof KalkulacijaFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Ukloni grešku kada korisnik promijeni polje
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNumberChange = (field: keyof KalkulacijaFormData, value: string) => {
    const numValue = parseFloat(value) || 0;
    handleChange(field, numValue);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.objekat.trim()) {
      newErrors.objekat = 'Ovo polje je obavezno';
    }
    if (!formData.mjesto_gradnje.trim()) {
      newErrors.mjesto_gradnje = 'Ovo polje je obavezno';
    }
    if (formData.povrsina_objekta_m2 <= 0) {
      newErrors.povrsina_objekta_m2 = 'Molimo unesite broj veći od nule';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Molimo ispravite greške u formi');
      return;
    }

    setIsSaving(true);
    const result = await createKalkulacija(formData);
    setIsSaving(false);

    if (result) {
      navigate(`/kalkulacija/${result.id}/edit`);
    }
  };

  const handlePrint = () => {
    toast.info('Funkcija štampanja bit će dostupna nakon spremanja kalkulacije');
  };

  // Izračunaj ukupne troškove
  const inoUkupno = formData.ino_broj_radnika * formData.ino_broj_dana * 
    (formData.ino_cijena_smjestaja_km + formData.ino_cijena_ishrane_km + formData.ino_terenska_dnevnica_km);
  
  const bihUkupno = formData.bih_broj_radnika * formData.bih_broj_dana * 
    (formData.bih_cijena_smjestaja_km + formData.bih_cijena_ishrane_km + formData.bih_terenska_dnevnica_km);

  return (
    <Layout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Naslov */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Nova kalkulacija</h1>
            <p className="text-muted-foreground mt-1">Unesite osnovne podatke za novu kalkulaciju</p>
          </div>
        </div>

        {/* Forma */}
        <div className="grid gap-6">
          {/* Sekcija 1: Osnovni podaci o objektu */}
          <Card>
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="text-primary">Osnovni podaci o objektu</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="datum_kalkulacije">Datum kalkulacije</Label>
                  <Input
                    id="datum_kalkulacije"
                    type="date"
                    value={formData.datum_kalkulacije}
                    onChange={(e) => handleChange('datum_kalkulacije', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="verzija">Verzija</Label>
                  <Input
                    id="verzija"
                    value={formData.verzija}
                    onChange={(e) => handleChange('verzija', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="drzava">Država</Label>
                  <Select value={formData.drzava} onValueChange={(value) => handleChange('drzava', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BiH">BiH</SelectItem>
                      <SelectItem value="Hrvatska">Hrvatska</SelectItem>
                      <SelectItem value="Srbija">Srbija</SelectItem>
                      <SelectItem value="Slovenija">Slovenija</SelectItem>
                      <SelectItem value="Crna Gora">Crna Gora</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="objekat">Objekat *</Label>
                  <Input
                    id="objekat"
                    value={formData.objekat}
                    onChange={(e) => handleChange('objekat', e.target.value)}
                    placeholder="Npr. Lidl"
                    className={errors.objekat ? 'border-destructive' : ''}
                  />
                  {errors.objekat && <p className="text-sm text-destructive">{errors.objekat}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mjesto_gradnje">Mjesto gradnje *</Label>
                  <Input
                    id="mjesto_gradnje"
                    value={formData.mjesto_gradnje}
                    onChange={(e) => handleChange('mjesto_gradnje', e.target.value)}
                    placeholder="Npr. Zagreb"
                    className={errors.mjesto_gradnje ? 'border-destructive' : ''}
                  />
                  {errors.mjesto_gradnje && <p className="text-sm text-destructive">{errors.mjesto_gradnje}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="udaljenost_km">Udaljenost (km)</Label>
                  <Input
                    id="udaljenost_km"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.udaljenost_km}
                    onChange={(e) => handleNumberChange('udaljenost_km', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="povrsina_objekta_m2">Površina objekta (m²) *</Label>
                  <Input
                    id="povrsina_objekta_m2"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.povrsina_objekta_m2}
                    onChange={(e) => handleNumberChange('povrsina_objekta_m2', e.target.value)}
                    className={errors.povrsina_objekta_m2 ? 'border-destructive' : ''}
                  />
                  {errors.povrsina_objekta_m2 && <p className="text-sm text-destructive">{errors.povrsina_objekta_m2}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tlocrt_objekta_m2">Tlocrt objekta (m²)</Label>
                  <Input
                    id="tlocrt_objekta_m2"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.tlocrt_objekta_m2}
                    onChange={(e) => handleNumberChange('tlocrt_objekta_m2', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ponuda">Ponuda</Label>
                  <Select value={formData.ponuda} onValueChange={(value) => handleChange('ponuda', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DA">DA</SelectItem>
                      <SelectItem value="NE">NE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sekcija 2: Rad u proizvodnji */}
          <Card>
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="text-primary">Rad u proizvodnji</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rad_proiz_armiraci_km_kg">Armirači i utezači (KM/kg)</Label>
                  <Input
                    id="rad_proiz_armiraci_km_kg"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.rad_proiz_armiraci_km_kg}
                    onChange={(e) => handleNumberChange('rad_proiz_armiraci_km_kg', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rad_proiz_kalupari_km_m3">Kalupari (KM/m³)</Label>
                  <Input
                    id="rad_proiz_kalupari_km_m3"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.rad_proiz_kalupari_km_m3}
                    onChange={(e) => handleNumberChange('rad_proiz_kalupari_km_m3', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rad_proiz_betonirci_km_m3">Betonirci (KM/m³)</Label>
                  <Input
                    id="rad_proiz_betonirci_km_m3"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.rad_proiz_betonirci_km_m3}
                    onChange={(e) => handleNumberChange('rad_proiz_betonirci_km_m3', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rad_proiz_sanacija_km_m3">Sanacija i utovar (KM/m³)</Label>
                  <Input
                    id="rad_proiz_sanacija_km_m3"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.rad_proiz_sanacija_km_m3}
                    onChange={(e) => handleNumberChange('rad_proiz_sanacija_km_m3', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sekcija 3: Indirektni troškovi */}
          <Card>
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="text-primary">Indirektni troškovi (%)</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ind_administracija">Administracija</Label>
                  <Input
                    id="ind_administracija"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.ind_administracija}
                    onChange={(e) => handleNumberChange('ind_administracija', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ind_tehnicka_priprema">Tehnička priprema</Label>
                  <Input
                    id="ind_tehnicka_priprema"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.ind_tehnicka_priprema}
                    onChange={(e) => handleNumberChange('ind_tehnicka_priprema', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ind_biro">Biro</Label>
                  <Input
                    id="ind_biro"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.ind_biro}
                    onChange={(e) => handleNumberChange('ind_biro', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ind_prodaja">Prodaja</Label>
                  <Input
                    id="ind_prodaja"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.ind_prodaja}
                    onChange={(e) => handleNumberChange('ind_prodaja', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ind_elektricna_energija">Električna energija</Label>
                  <Input
                    id="ind_elektricna_energija"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.ind_elektricna_energija}
                    onChange={(e) => handleNumberChange('ind_elektricna_energija', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ind_odrzavanje_fabrike">Održavanje fabrike</Label>
                  <Input
                    id="ind_odrzavanje_fabrike"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.ind_odrzavanje_fabrike}
                    onChange={(e) => handleNumberChange('ind_odrzavanje_fabrike', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ind_amortizacija">Amortizacija</Label>
                  <Input
                    id="ind_amortizacija"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.ind_amortizacija}
                    onChange={(e) => handleNumberChange('ind_amortizacija', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sekcija 4: Transport i montaža */}
          <Card>
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="text-primary">Transport, montaža i statika</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rad_transport_km_m3">Transport (KM/m³)</Label>
                  <Input
                    id="rad_transport_km_m3"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.rad_transport_km_m3}
                    onChange={(e) => handleNumberChange('rad_transport_km_m3', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rad_mont_montazna_km_m3">Montaža - Montažna konstr. (KM/m³)</Label>
                  <Input
                    id="rad_mont_montazna_km_m3"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.rad_mont_montazna_km_m3}
                    onChange={(e) => handleNumberChange('rad_mont_montazna_km_m3', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rad_mont_suplje_ploce_km_m2">Montaža - Šuplje ploče (KM/m²)</Label>
                  <Input
                    id="rad_mont_suplje_ploce_km_m2"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.rad_mont_suplje_ploce_km_m2}
                    onChange={(e) => handleNumberChange('rad_mont_suplje_ploce_km_m2', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mat_mont_km_m3">Materijal na montaži (KM/m³)</Label>
                  <Input
                    id="mat_mont_km_m3"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.mat_mont_km_m3}
                    onChange={(e) => handleNumberChange('mat_mont_km_m3', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rad_static_km_m3">Statika - Montažna konstr. (KM/m³)</Label>
                  <Input
                    id="rad_static_km_m3"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.rad_static_km_m3}
                    onChange={(e) => handleNumberChange('rad_static_km_m3', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rad_static_suplje_km_m2">Statika - Šuplje ploče (KM/m²)</Label>
                  <Input
                    id="rad_static_suplje_km_m2"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.rad_static_suplje_km_m2}
                    onChange={(e) => handleNumberChange('rad_static_suplje_km_m2', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sekcija 5: Troškovi - Inostranstvo i BiH */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inostranstvo */}
            <Card>
              <CardHeader className="bg-primary/5 border-b">
                <CardTitle className="text-primary">Troškovi - Inostranstvo</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ino_broj_radnika">Broj radnika</Label>
                    <Input
                      id="ino_broj_radnika"
                      type="number"
                      min="0"
                      value={formData.ino_broj_radnika}
                      onChange={(e) => handleNumberChange('ino_broj_radnika', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ino_broj_dana">Broj dana</Label>
                    <Input
                      id="ino_broj_dana"
                      type="number"
                      min="0"
                      value={formData.ino_broj_dana}
                      onChange={(e) => handleNumberChange('ino_broj_dana', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ino_cijena_smjestaja_km">Cijena smještaja (KM)</Label>
                    <Input
                      id="ino_cijena_smjestaja_km"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.ino_cijena_smjestaja_km}
                      onChange={(e) => handleNumberChange('ino_cijena_smjestaja_km', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ino_cijena_ishrane_km">Cijena ishrane (KM)</Label>
                    <Input
                      id="ino_cijena_ishrane_km"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.ino_cijena_ishrane_km}
                      onChange={(e) => handleNumberChange('ino_cijena_ishrane_km', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ino_terenska_dnevnica_km">Terenska dnevnica (KM)</Label>
                    <Input
                      id="ino_terenska_dnevnica_km"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.ino_terenska_dnevnica_km}
                      onChange={(e) => handleNumberChange('ino_terenska_dnevnica_km', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ukupno (KM)</Label>
                    <div className="h-10 px-3 py-2 rounded-md border bg-muted font-semibold text-primary">
                      {inoUkupno.toLocaleString('bs-BA', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* BiH */}
            <Card>
              <CardHeader className="bg-primary/5 border-b">
                <CardTitle className="text-primary">Troškovi - BiH</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bih_broj_radnika">Broj radnika</Label>
                    <Input
                      id="bih_broj_radnika"
                      type="number"
                      min="0"
                      value={formData.bih_broj_radnika}
                      onChange={(e) => handleNumberChange('bih_broj_radnika', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bih_broj_dana">Broj dana</Label>
                    <Input
                      id="bih_broj_dana"
                      type="number"
                      min="0"
                      value={formData.bih_broj_dana}
                      onChange={(e) => handleNumberChange('bih_broj_dana', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bih_cijena_smjestaja_km">Cijena smještaja (KM)</Label>
                    <Input
                      id="bih_cijena_smjestaja_km"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.bih_cijena_smjestaja_km}
                      onChange={(e) => handleNumberChange('bih_cijena_smjestaja_km', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bih_cijena_ishrane_km">Cijena ishrane (KM)</Label>
                    <Input
                      id="bih_cijena_ishrane_km"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.bih_cijena_ishrane_km}
                      onChange={(e) => handleNumberChange('bih_cijena_ishrane_km', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bih_terenska_dnevnica_km">Terenska dnevnica (KM)</Label>
                    <Input
                      id="bih_terenska_dnevnica_km"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.bih_terenska_dnevnica_km}
                      onChange={(e) => handleNumberChange('bih_terenska_dnevnica_km', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ukupno (KM)</Label>
                    <div className="h-10 px-3 py-2 rounded-md border bg-muted font-semibold text-primary">
                      {bihUkupno.toLocaleString('bs-BA', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Akcijske tipke */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Nazad
            </Button>
            <Button variant="outline" onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Spremanje...' : 'Sačuvaj'}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Printaj
            </Button>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Spremanje...' : 'Sačuvaj i nastavi'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </Layout>
  );
}
