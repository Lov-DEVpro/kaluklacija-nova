export interface Kalkulacija {
  id: string;
  user_id: string;
  datum_kalkulacije: string;
  verzija: string;
  drzava: string;
  objekat: string;
  mjesto_gradnje: string;
  udaljenost_km: number;
  povrsina_objekta_m2: number;
  tlocrt_objekta_m2: number;
  ponuda: string;
  
  // Status i zaključavanje
  status: string;
  zakljucano: boolean;
  datum_zakljucanja: string | null;
  
  // Rad u proizvodnji
  rad_proiz_armiraci_km_kg: number;
  rad_proiz_kalupari_km_m3: number;
  rad_proiz_betonirci_km_m3: number;
  rad_proiz_sanacija_km_m3: number;
  
  // Indirektni troškovi
  ind_administracija: number;
  ind_tehnicka_priprema: number;
  ind_biro: number;
  ind_prodaja: number;
  ind_elektricna_energija: number;
  ind_odrzavanje_fabrike: number;
  ind_amortizacija: number;
  
  // Transport
  rad_transport_km_m3: number;
  
  // Montaža
  rad_mont_montazna_km_m3: number;
  rad_mont_suplje_ploce_km_m2: number;
  mat_mont_km_m3: number;
  
  // Statika
  rad_static_km_m3: number;
  rad_static_suplje_km_m2: number;
  
  // Inostranstvo
  ino_broj_radnika: number;
  ino_broj_dana: number;
  ino_cijena_smjestaja_km: number;
  ino_cijena_ishrane_km: number;
  ino_terenska_dnevnica_km: number;
  ino_ukupno_km: number;
  
  // BiH
  bih_broj_radnika: number;
  bih_broj_dana: number;
  bih_cijena_smjestaja_km: number;
  bih_cijena_ishrane_km: number;
  bih_terenska_dnevnica_km: number;
  bih_ukupno_km: number;
  
  // Ukupni troškovi
  ukupno_direktni_troskovi: number;
  ukupno_indirektni_troskovi: number;
  ukupno_rap_it: number;
  ukupna_cijena: number;
  cijena_po_m2: number;
  
  created_at: string;
  updated_at: string;
}

export interface KalkulacijaFormData {
  datum_kalkulacije: string;
  verzija: string;
  drzava: string;
  objekat: string;
  mjesto_gradnje: string;
  udaljenost_km: number;
  povrsina_objekta_m2: number;
  tlocrt_objekta_m2: number;
  ponuda: string;
  
  rad_proiz_armiraci_km_kg: number;
  rad_proiz_kalupari_km_m3: number;
  rad_proiz_betonirci_km_m3: number;
  rad_proiz_sanacija_km_m3: number;
  
  ind_administracija: number;
  ind_tehnicka_priprema: number;
  ind_biro: number;
  ind_prodaja: number;
  ind_elektricna_energija: number;
  ind_odrzavanje_fabrike: number;
  ind_amortizacija: number;
  
  rad_transport_km_m3: number;
  
  rad_mont_montazna_km_m3: number;
  rad_mont_suplje_ploce_km_m2: number;
  mat_mont_km_m3: number;
  
  rad_static_km_m3: number;
  rad_static_suplje_km_m2: number;
  
  ino_broj_radnika: number;
  ino_broj_dana: number;
  ino_cijena_smjestaja_km: number;
  ino_cijena_ishrane_km: number;
  ino_terenska_dnevnica_km: number;
  
  bih_broj_radnika: number;
  bih_broj_dana: number;
  bih_cijena_smjestaja_km: number;
  bih_cijena_ishrane_km: number;
  bih_terenska_dnevnica_km: number;
}

export interface ElementKalkulacije {
  id: string;
  kalkulacija_id: string;
  tip_elementa_id: string | null;
  naziv_elementa: string;
  dimenzije: string | null;
  kolicina: number;
  beton_m3: number;
  armatura_kg: number;
  kablovi_kg: number;
  marka_betona: string;
  cijena_materijala_km: number;
  cijena_rada_km: number;
  ukupna_cijena_km: number;
  created_at: string;
}

export interface TransportKalkulacije {
  id: string;
  kalkulacija_id: string;
  tip_ture: 'G' | 'VG';
  udaljenost_km: number;
  cijena_po_m3: number;
  broj_tura: number;
  ukupna_cijena_km: number;
  created_at: string;
}

export interface TipElementa {
  id: string;
  naziv_tipa: string;
  kategorija: string | null;
  dimenzije: string | null;
  napomena: string | null;
  redoslijed: number;
  created_at: string;
}

export interface Materijal {
  id: string;
  imel_sifra: string | null;
  naziv_materijala: string;
  jedinica_mjere: string;
  cijena_km: number;
  created_at: string;
}

export interface ParametarElementa {
  id: string;
  tip_elementa_id: string | null;
  marka_betona: string;
  beton_km_m3: number;
  armatura_kg_m3: number;
  armatura_koeficijent: number;
  kablovi_kg_m3: number;
  kablovi_km_kg: number;
  ostalo_postotak: number;
  created_at: string;
}

export interface CalculationSnapshot {
  id: string;
  kalkulacija_id: string;
  snapshot_data: Record<string, unknown>;
  created_at: string;
  created_by: string;
}

// Kategorije elemenata prema Excel dokumentu
export const ELEMENT_CATEGORIES = [
  { value: 'temeljna_konstrukcija', label: 'Temeljna konstrukcija' },
  { value: 'temeljne_stope', label: 'Temeljne stope' },
  { value: 'temeljne_case', label: 'Temeljne čaše' },
  { value: 'medutemelji', label: 'Međutemelji' },
  { value: 'temeljne_vezne_grede', label: 'Temeljne vezne grede' },
  { value: 'pretovarne_rampe', label: 'Pretovarne rampe' },
  { value: 'stubovi', label: 'Stubovi' },
  { value: 'spratne_grede', label: 'Spratne grede' },
  { value: 'stropne_pi_ploce', label: 'Stropne PI ploče' },
  { value: 'krovna_konstrukcija', label: 'Krovna konstrukcija' },
  { value: 'suplje_ploce', label: 'Šuplje ploče' },
  { value: 'fasade', label: 'Fasade' },
  { value: 'roznjace', label: 'Rožnjače' },
] as const;

// Marke betona
export const MARKE_BETONA = ['MB30', 'MB40', 'MB45', 'MB50'] as const;
