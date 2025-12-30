-- Fix remaining policies and add new columns/tables
-- Drop the duplicate policies (without trailing space versions)
DROP POLICY IF EXISTS "Korisnici mogu vidjeti svoje kalkulacije" ON kalkulacije;
DROP POLICY IF EXISTS "Korisnici mogu kreirati svoje kalkulacije" ON kalkulacije;
DROP POLICY IF EXISTS "Korisnici mogu ažurirati svoje kalkulacije" ON kalkulacije;
DROP POLICY IF EXISTS "Korisnici mogu brisati svoje kalkulacije" ON kalkulacije;

-- Recreate permissive policies for kalkulacije
CREATE POLICY "Korisnici mogu vidjeti svoje kalkulacije"
ON kalkulacije FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Korisnici mogu kreirati svoje kalkulacije"
ON kalkulacije FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Korisnici mogu ažurirati svoje kalkulacije"
ON kalkulacije FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Korisnici mogu brisati svoje kalkulacije"
ON kalkulacije FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Drop and recreate element_kalkulacije policies
DROP POLICY IF EXISTS "Korisnici mogu vidjeti elemente svojih kalkulacija" ON element_kalkulacije;
DROP POLICY IF EXISTS "Korisnici mogu kreirati elemente svojih kalkulacija" ON element_kalkulacije;
DROP POLICY IF EXISTS "Korisnici mogu ažurirati elemente svojih kalkulacija" ON element_kalkulacije;
DROP POLICY IF EXISTS "Korisnici mogu brisati elemente svojih kalkulacija" ON element_kalkulacije;

CREATE POLICY "Korisnici mogu vidjeti elemente svojih kalkulacija"
ON element_kalkulacije FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM kalkulacije WHERE kalkulacije.id = element_kalkulacije.kalkulacija_id AND kalkulacije.user_id = auth.uid()));

CREATE POLICY "Korisnici mogu kreirati elemente svojih kalkulacija"
ON element_kalkulacije FOR INSERT
TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM kalkulacije WHERE kalkulacije.id = element_kalkulacije.kalkulacija_id AND kalkulacije.user_id = auth.uid()));

CREATE POLICY "Korisnici mogu ažurirati elemente svojih kalkulacija"
ON element_kalkulacije FOR UPDATE
TO authenticated
USING (EXISTS (SELECT 1 FROM kalkulacije WHERE kalkulacije.id = element_kalkulacije.kalkulacija_id AND kalkulacije.user_id = auth.uid()));

CREATE POLICY "Korisnici mogu brisati elemente svojih kalkulacija"
ON element_kalkulacije FOR DELETE
TO authenticated
USING (EXISTS (SELECT 1 FROM kalkulacije WHERE kalkulacije.id = element_kalkulacije.kalkulacija_id AND kalkulacije.user_id = auth.uid()));

-- Drop and recreate transport_kalkulacije policies
DROP POLICY IF EXISTS "Korisnici mogu vidjeti transport svojih kalkulacija" ON transport_kalkulacije;
DROP POLICY IF EXISTS "Korisnici mogu kreirati transport svojih kalkulacija" ON transport_kalkulacije;
DROP POLICY IF EXISTS "Korisnici mogu ažurirati transport svojih kalkulacija" ON transport_kalkulacije;
DROP POLICY IF EXISTS "Korisnici mogu brisati transport svojih kalkulacija" ON transport_kalkulacije;

CREATE POLICY "Korisnici mogu vidjeti transport svojih kalkulacija"
ON transport_kalkulacije FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM kalkulacije WHERE kalkulacije.id = transport_kalkulacije.kalkulacija_id AND kalkulacije.user_id = auth.uid()));

CREATE POLICY "Korisnici mogu kreirati transport svojih kalkulacija"
ON transport_kalkulacije FOR INSERT
TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM kalkulacije WHERE kalkulacije.id = transport_kalkulacije.kalkulacija_id AND kalkulacije.user_id = auth.uid()));

CREATE POLICY "Korisnici mogu ažurirati transport svojih kalkulacija"
ON transport_kalkulacije FOR UPDATE
TO authenticated
USING (EXISTS (SELECT 1 FROM kalkulacije WHERE kalkulacije.id = transport_kalkulacije.kalkulacija_id AND kalkulacije.user_id = auth.uid()));

CREATE POLICY "Korisnici mogu brisati transport svojih kalkulacija"
ON transport_kalkulacije FOR DELETE
TO authenticated
USING (EXISTS (SELECT 1 FROM kalkulacije WHERE kalkulacije.id = transport_kalkulacije.kalkulacija_id AND kalkulacije.user_id = auth.uid()));

-- Reference tables
DROP POLICY IF EXISTS "Svi mogu vidjeti materijale" ON materijal;
DROP POLICY IF EXISTS "Svi mogu vidjeti materijale po elementu" ON materijal_po_elementu;
DROP POLICY IF EXISTS "Svi mogu vidjeti parametre elemenata" ON parametar_elementa;
DROP POLICY IF EXISTS "Svi mogu vidjeti tipove elemenata" ON tip_elementa;

CREATE POLICY "Svi mogu vidjeti materijale"
ON materijal FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Svi mogu vidjeti materijale po elementu"
ON materijal_po_elementu FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Svi mogu vidjeti parametre elemenata"
ON parametar_elementa FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Svi mogu vidjeti tipove elemenata"
ON tip_elementa FOR SELECT
TO authenticated
USING (true);

-- profiles and user_roles
DROP POLICY IF EXISTS "Korisnici mogu vidjeti svoje profile" ON profiles;
DROP POLICY IF EXISTS "Korisnici mogu ažurirati svoje profile" ON profiles;
DROP POLICY IF EXISTS "Korisnici mogu vidjeti svoje uloge" ON user_roles;

CREATE POLICY "Korisnici mogu vidjeti svoje profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Korisnici mogu ažurirati svoje profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Korisnici mogu vidjeti svoje uloge"
ON user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Add status and locking columns to kalkulacije
ALTER TABLE kalkulacije ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft';
ALTER TABLE kalkulacije ADD COLUMN IF NOT EXISTS zakljucano BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE kalkulacije ADD COLUMN IF NOT EXISTS datum_zakljucanja TIMESTAMP WITH TIME ZONE;

-- Create calculation_snapshots table for freezing calculations
CREATE TABLE IF NOT EXISTS public.calculation_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kalkulacija_id UUID NOT NULL REFERENCES kalkulacije(id) ON DELETE CASCADE,
  snapshot_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE calculation_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Korisnici mogu vidjeti snapshotove svojih kalkulacija" ON calculation_snapshots;
DROP POLICY IF EXISTS "Korisnici mogu kreirati snapshotove svojih kalkulacija" ON calculation_snapshots;

CREATE POLICY "Korisnici mogu vidjeti snapshotove svojih kalkulacija"
ON calculation_snapshots FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM kalkulacije WHERE kalkulacije.id = calculation_snapshots.kalkulacija_id AND kalkulacije.user_id = auth.uid()));

CREATE POLICY "Korisnici mogu kreirati snapshotove svojih kalkulacija"
ON calculation_snapshots FOR INSERT
TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM kalkulacije WHERE kalkulacije.id = calculation_snapshots.kalkulacija_id AND kalkulacije.user_id = auth.uid()));