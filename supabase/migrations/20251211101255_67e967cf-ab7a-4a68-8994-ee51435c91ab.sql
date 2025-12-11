-- Kreiranje enum za uloge korisnika
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Kreiranje tabele profila korisnika
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  ime TEXT,
  prezime TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Kreiranje tabele uloga korisnika
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Kreiranje tabele tipova elemenata
CREATE TABLE public.tip_elementa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  naziv_tipa TEXT NOT NULL,
  kategorija TEXT,
  dimenzije TEXT,
  napomena TEXT,
  redoslijed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Kreiranje tabele materijala
CREATE TABLE public.materijal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  imel_sifra TEXT,
  naziv_materijala TEXT NOT NULL,
  jedinica_mjere TEXT NOT NULL DEFAULT 'kom',
  cijena_km NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Kreiranje glavne tabele kalkulacija
CREATE TABLE public.kalkulacije (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  datum_kalkulacije DATE NOT NULL DEFAULT CURRENT_DATE,
  verzija TEXT NOT NULL DEFAULT 'v1',
  drzava TEXT NOT NULL DEFAULT 'BiH',
  objekat TEXT NOT NULL,
  mjesto_gradnje TEXT NOT NULL,
  udaljenost_km NUMERIC(10,2) DEFAULT 0,
  povrsina_objekta_m2 NUMERIC(12,2) DEFAULT 0,
  tlocrt_objekta_m2 NUMERIC(12,2) DEFAULT 0,
  ponuda TEXT DEFAULT 'NE',
  
  -- Rad u proizvodnji
  rad_proiz_armiraci_km_kg NUMERIC(12,4) DEFAULT 0,
  rad_proiz_kalupari_km_m3 NUMERIC(12,4) DEFAULT 0,
  rad_proiz_betonirci_km_m3 NUMERIC(12,4) DEFAULT 0,
  rad_proiz_sanacija_km_m3 NUMERIC(12,4) DEFAULT 0,
  
  -- Indirektni troškovi
  ind_administracija NUMERIC(12,4) DEFAULT 0,
  ind_tehnicka_priprema NUMERIC(12,4) DEFAULT 0,
  ind_biro NUMERIC(12,4) DEFAULT 0,
  ind_prodaja NUMERIC(12,4) DEFAULT 0,
  ind_elektricna_energija NUMERIC(12,4) DEFAULT 0,
  ind_odrzavanje_fabrike NUMERIC(12,4) DEFAULT 0,
  ind_amortizacija NUMERIC(12,4) DEFAULT 0,
  
  -- Transport
  rad_transport_km_m3 NUMERIC(12,4) DEFAULT 0,
  
  -- Montaža
  rad_mont_montazna_km_m3 NUMERIC(12,4) DEFAULT 0,
  rad_mont_suplje_ploce_km_m2 NUMERIC(12,4) DEFAULT 0,
  mat_mont_km_m3 NUMERIC(12,4) DEFAULT 0,
  
  -- Statika
  rad_static_km_m3 NUMERIC(12,4) DEFAULT 0,
  rad_static_suplje_km_m2 NUMERIC(12,4) DEFAULT 0,
  
  -- Inostranstvo
  ino_broj_radnika INTEGER DEFAULT 0,
  ino_broj_dana INTEGER DEFAULT 0,
  ino_cijena_smjestaja_km NUMERIC(10,2) DEFAULT 0,
  ino_cijena_ishrane_km NUMERIC(10,2) DEFAULT 0,
  ino_terenska_dnevnica_km NUMERIC(10,2) DEFAULT 0,
  ino_ukupno_km NUMERIC(12,2) DEFAULT 0,
  
  -- BiH
  bih_broj_radnika INTEGER DEFAULT 0,
  bih_broj_dana INTEGER DEFAULT 0,
  bih_cijena_smjestaja_km NUMERIC(10,2) DEFAULT 0,
  bih_cijena_ishrane_km NUMERIC(10,2) DEFAULT 0,
  bih_terenska_dnevnica_km NUMERIC(10,2) DEFAULT 0,
  bih_ukupno_km NUMERIC(12,2) DEFAULT 0,
  
  -- Ukupni troškovi
  ukupno_direktni_troskovi NUMERIC(14,2) DEFAULT 0,
  ukupno_indirektni_troskovi NUMERIC(14,2) DEFAULT 0,
  ukupno_rap_it NUMERIC(14,2) DEFAULT 0,
  ukupna_cijena NUMERIC(14,2) DEFAULT 0,
  cijena_po_m2 NUMERIC(12,2) DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Kreiranje tabele elemenata kalkulacije
CREATE TABLE public.element_kalkulacije (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kalkulacija_id UUID REFERENCES public.kalkulacije(id) ON DELETE CASCADE NOT NULL,
  tip_elementa_id UUID REFERENCES public.tip_elementa(id),
  naziv_elementa TEXT NOT NULL,
  dimenzije TEXT,
  kolicina INTEGER DEFAULT 0,
  beton_m3 NUMERIC(10,4) DEFAULT 0,
  armatura_kg NUMERIC(10,2) DEFAULT 0,
  kablovi_kg NUMERIC(10,2) DEFAULT 0,
  marka_betona TEXT DEFAULT 'MB40',
  cijena_materijala_km NUMERIC(12,2) DEFAULT 0,
  cijena_rada_km NUMERIC(12,2) DEFAULT 0,
  ukupna_cijena_km NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Kreiranje tabele transporta
CREATE TABLE public.transport_kalkulacije (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kalkulacija_id UUID REFERENCES public.kalkulacije(id) ON DELETE CASCADE NOT NULL,
  tip_ture TEXT NOT NULL DEFAULT 'G',
  udaljenost_km NUMERIC(10,2) DEFAULT 0,
  cijena_po_m3 NUMERIC(10,2) DEFAULT 0,
  broj_tura INTEGER DEFAULT 0,
  ukupna_cijena_km NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Kreiranje tabele parametara elemenata
CREATE TABLE public.parametar_elementa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tip_elementa_id UUID REFERENCES public.tip_elementa(id) ON DELETE CASCADE,
  marka_betona TEXT NOT NULL DEFAULT 'MB40',
  beton_km_m3 NUMERIC(10,2) DEFAULT 0,
  armatura_koeficijent NUMERIC(10,4) DEFAULT 0,
  armatura_kg_m3 NUMERIC(10,2) DEFAULT 0,
  kablovi_km_kg NUMERIC(10,4) DEFAULT 0,
  kablovi_kg_m3 NUMERIC(10,2) DEFAULT 0,
  ostalo_postotak NUMERIC(5,4) DEFAULT 0.05,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Kreiranje tabele veze materijala i elemenata
CREATE TABLE public.materijal_po_elementu (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tip_elementa_id UUID REFERENCES public.tip_elementa(id) ON DELETE CASCADE NOT NULL,
  materijal_id UUID REFERENCES public.materijal(id) ON DELETE CASCADE NOT NULL,
  kolicina_po_elementu NUMERIC(12,4) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Omogućavanje RLS na svim tabelama
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kalkulacije ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.element_kalkulacije ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_kalkulacije ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tip_elementa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materijal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parametar_elementa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materijal_po_elementu ENABLE ROW LEVEL SECURITY;

-- Funkcija za provjeru uloge korisnika
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Funkcija za kreiranje profila pri registraciji
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger za automatsko kreiranje profila
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Funkcija za ažuriranje updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggeri za ažuriranje updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kalkulacije_updated_at
  BEFORE UPDATE ON public.kalkulacije
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS politike za profiles
CREATE POLICY "Korisnici mogu vidjeti svoje profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Korisnici mogu ažurirati svoje profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS politike za user_roles
CREATE POLICY "Korisnici mogu vidjeti svoje uloge"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- RLS politike za kalkulacije
CREATE POLICY "Korisnici mogu vidjeti svoje kalkulacije"
  ON public.kalkulacije FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Korisnici mogu kreirati svoje kalkulacije"
  ON public.kalkulacije FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Korisnici mogu ažurirati svoje kalkulacije"
  ON public.kalkulacije FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Korisnici mogu brisati svoje kalkulacije"
  ON public.kalkulacije FOR DELETE
  USING (auth.uid() = user_id);

-- RLS politike za element_kalkulacije
CREATE POLICY "Korisnici mogu vidjeti elemente svojih kalkulacija"
  ON public.element_kalkulacije FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.kalkulacije
      WHERE kalkulacije.id = element_kalkulacije.kalkulacija_id
      AND kalkulacije.user_id = auth.uid()
    )
  );

CREATE POLICY "Korisnici mogu kreirati elemente svojih kalkulacija"
  ON public.element_kalkulacije FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.kalkulacije
      WHERE kalkulacije.id = element_kalkulacije.kalkulacija_id
      AND kalkulacije.user_id = auth.uid()
    )
  );

CREATE POLICY "Korisnici mogu ažurirati elemente svojih kalkulacija"
  ON public.element_kalkulacije FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.kalkulacije
      WHERE kalkulacije.id = element_kalkulacije.kalkulacija_id
      AND kalkulacije.user_id = auth.uid()
    )
  );

CREATE POLICY "Korisnici mogu brisati elemente svojih kalkulacija"
  ON public.element_kalkulacije FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.kalkulacije
      WHERE kalkulacije.id = element_kalkulacije.kalkulacija_id
      AND kalkulacije.user_id = auth.uid()
    )
  );

-- RLS politike za transport_kalkulacije
CREATE POLICY "Korisnici mogu vidjeti transport svojih kalkulacija"
  ON public.transport_kalkulacije FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.kalkulacije
      WHERE kalkulacije.id = transport_kalkulacije.kalkulacija_id
      AND kalkulacije.user_id = auth.uid()
    )
  );

CREATE POLICY "Korisnici mogu kreirati transport svojih kalkulacija"
  ON public.transport_kalkulacije FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.kalkulacije
      WHERE kalkulacije.id = transport_kalkulacije.kalkulacija_id
      AND kalkulacije.user_id = auth.uid()
    )
  );

CREATE POLICY "Korisnici mogu ažurirati transport svojih kalkulacija"
  ON public.transport_kalkulacije FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.kalkulacije
      WHERE kalkulacije.id = transport_kalkulacije.kalkulacija_id
      AND kalkulacije.user_id = auth.uid()
    )
  );

CREATE POLICY "Korisnici mogu brisati transport svojih kalkulacija"
  ON public.transport_kalkulacije FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.kalkulacije
      WHERE kalkulacije.id = transport_kalkulacije.kalkulacija_id
      AND kalkulacije.user_id = auth.uid()
    )
  );

-- RLS politike za tip_elementa (javno čitanje)
CREATE POLICY "Svi mogu vidjeti tipove elemenata"
  ON public.tip_elementa FOR SELECT
  TO authenticated
  USING (true);

-- RLS politike za materijal (javno čitanje)
CREATE POLICY "Svi mogu vidjeti materijale"
  ON public.materijal FOR SELECT
  TO authenticated
  USING (true);

-- RLS politike za parametar_elementa (javno čitanje)
CREATE POLICY "Svi mogu vidjeti parametre elemenata"
  ON public.parametar_elementa FOR SELECT
  TO authenticated
  USING (true);

-- RLS politike za materijal_po_elementu (javno čitanje)
CREATE POLICY "Svi mogu vidjeti materijale po elementu"
  ON public.materijal_po_elementu FOR SELECT
  TO authenticated
  USING (true);

-- Umetanje početnih tipova elemenata
INSERT INTO public.tip_elementa (naziv_tipa, kategorija, redoslijed) VALUES
  ('TEMELJNE STOPE', 'Temeljna konstrukcija', 1),
  ('TEMELJNE ČAŠE', 'Temeljna konstrukcija', 2),
  ('VEZNE GREDE', 'Temeljna konstrukcija', 3),
  ('STUBOVI BEZ KONZOLE', 'Stubovi', 4),
  ('STUBOVI SA KONZOLOM', 'Stubovi', 5),
  ('SPRATNE GREDE', 'Grede', 6),
  ('PI PLOČE', 'Ploče', 7),
  ('TT PLOČE', 'Ploče', 8),
  ('ŠUPLJE PLOČE PPB 200', 'Ploče', 9),
  ('ŠUPLJE PLOČE PPB 300', 'Ploče', 10),
  ('KROVNA KONSTRUKCIJA', 'Krovna konstrukcija', 11),
  ('T GREDE', 'Krovni nosači', 12),
  ('A NOSAČI', 'Krovni nosači', 13),
  ('I NOSAČI', 'Krovni nosači', 14),
  ('ROŽNJAČE', 'Krovni elementi', 15),
  ('FASADE', 'Fasadni elementi', 16),
  ('PRETOVARNE RAMPE', 'Ostalo', 17);

-- Umetanje početnih materijala
INSERT INTO public.materijal (imel_sifra, naziv_materijala, jedinica_mjere, cijena_km) VALUES
  ('BET-30', 'Beton MB30', 'm3', 120.00),
  ('BET-40', 'Beton MB40', 'm3', 140.00),
  ('BET-50', 'Beton MB50', 'm3', 160.00),
  ('BET-60', 'Beton MB60', 'm3', 180.00),
  ('ARM-B500B', 'Armatura B500B', 'kg', 1.50),
  ('KAB-Y1860', 'Kablovi Y1860', 'kg', 3.50),
  ('OPL-OSB', 'Oplata OSB', 'm2', 25.00),
  ('DIS-20', 'Distanceri 20mm', 'kom', 0.15),
  ('SID-M16', 'Sidreni vijci M16', 'kom', 8.50);