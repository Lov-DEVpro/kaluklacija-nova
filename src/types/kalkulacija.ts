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
  tip_ture: string;
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
