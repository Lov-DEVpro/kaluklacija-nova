export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      calculation_snapshots: {
        Row: {
          created_at: string
          created_by: string
          id: string
          kalkulacija_id: string
          snapshot_data: Json
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          kalkulacija_id: string
          snapshot_data: Json
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          kalkulacija_id?: string
          snapshot_data?: Json
        }
        Relationships: [
          {
            foreignKeyName: "calculation_snapshots_kalkulacija_id_fkey"
            columns: ["kalkulacija_id"]
            isOneToOne: false
            referencedRelation: "kalkulacije"
            referencedColumns: ["id"]
          },
        ]
      }
      element_kalkulacije: {
        Row: {
          armatura_kg: number | null
          beton_m3: number | null
          cijena_materijala_km: number | null
          cijena_rada_km: number | null
          created_at: string
          dimenzije: string | null
          id: string
          kablovi_kg: number | null
          kalkulacija_id: string
          kolicina: number | null
          marka_betona: string | null
          naziv_elementa: string
          tip_elementa_id: string | null
          ukupna_cijena_km: number | null
        }
        Insert: {
          armatura_kg?: number | null
          beton_m3?: number | null
          cijena_materijala_km?: number | null
          cijena_rada_km?: number | null
          created_at?: string
          dimenzije?: string | null
          id?: string
          kablovi_kg?: number | null
          kalkulacija_id: string
          kolicina?: number | null
          marka_betona?: string | null
          naziv_elementa: string
          tip_elementa_id?: string | null
          ukupna_cijena_km?: number | null
        }
        Update: {
          armatura_kg?: number | null
          beton_m3?: number | null
          cijena_materijala_km?: number | null
          cijena_rada_km?: number | null
          created_at?: string
          dimenzije?: string | null
          id?: string
          kablovi_kg?: number | null
          kalkulacija_id?: string
          kolicina?: number | null
          marka_betona?: string | null
          naziv_elementa?: string
          tip_elementa_id?: string | null
          ukupna_cijena_km?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "element_kalkulacije_kalkulacija_id_fkey"
            columns: ["kalkulacija_id"]
            isOneToOne: false
            referencedRelation: "kalkulacije"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "element_kalkulacije_tip_elementa_id_fkey"
            columns: ["tip_elementa_id"]
            isOneToOne: false
            referencedRelation: "tip_elementa"
            referencedColumns: ["id"]
          },
        ]
      }
      kalkulacije: {
        Row: {
          bih_broj_dana: number | null
          bih_broj_radnika: number | null
          bih_cijena_ishrane_km: number | null
          bih_cijena_smjestaja_km: number | null
          bih_terenska_dnevnica_km: number | null
          bih_ukupno_km: number | null
          cijena_po_m2: number | null
          created_at: string
          datum_kalkulacije: string
          datum_zakljucanja: string | null
          drzava: string
          id: string
          ind_administracija: number | null
          ind_amortizacija: number | null
          ind_biro: number | null
          ind_elektricna_energija: number | null
          ind_odrzavanje_fabrike: number | null
          ind_prodaja: number | null
          ind_tehnicka_priprema: number | null
          ino_broj_dana: number | null
          ino_broj_radnika: number | null
          ino_cijena_ishrane_km: number | null
          ino_cijena_smjestaja_km: number | null
          ino_terenska_dnevnica_km: number | null
          ino_ukupno_km: number | null
          mat_mont_km_m3: number | null
          mjesto_gradnje: string
          objekat: string
          ponuda: string | null
          povrsina_objekta_m2: number | null
          rad_mont_montazna_km_m3: number | null
          rad_mont_suplje_ploce_km_m2: number | null
          rad_proiz_armiraci_km_kg: number | null
          rad_proiz_betonirci_km_m3: number | null
          rad_proiz_kalupari_km_m3: number | null
          rad_proiz_sanacija_km_m3: number | null
          rad_static_km_m3: number | null
          rad_static_suplje_km_m2: number | null
          rad_transport_km_m3: number | null
          status: string
          tlocrt_objekta_m2: number | null
          udaljenost_km: number | null
          ukupna_cijena: number | null
          ukupno_direktni_troskovi: number | null
          ukupno_indirektni_troskovi: number | null
          ukupno_rap_it: number | null
          updated_at: string
          user_id: string
          verzija: string
          zakljucano: boolean
        }
        Insert: {
          bih_broj_dana?: number | null
          bih_broj_radnika?: number | null
          bih_cijena_ishrane_km?: number | null
          bih_cijena_smjestaja_km?: number | null
          bih_terenska_dnevnica_km?: number | null
          bih_ukupno_km?: number | null
          cijena_po_m2?: number | null
          created_at?: string
          datum_kalkulacije?: string
          datum_zakljucanja?: string | null
          drzava?: string
          id?: string
          ind_administracija?: number | null
          ind_amortizacija?: number | null
          ind_biro?: number | null
          ind_elektricna_energija?: number | null
          ind_odrzavanje_fabrike?: number | null
          ind_prodaja?: number | null
          ind_tehnicka_priprema?: number | null
          ino_broj_dana?: number | null
          ino_broj_radnika?: number | null
          ino_cijena_ishrane_km?: number | null
          ino_cijena_smjestaja_km?: number | null
          ino_terenska_dnevnica_km?: number | null
          ino_ukupno_km?: number | null
          mat_mont_km_m3?: number | null
          mjesto_gradnje: string
          objekat: string
          ponuda?: string | null
          povrsina_objekta_m2?: number | null
          rad_mont_montazna_km_m3?: number | null
          rad_mont_suplje_ploce_km_m2?: number | null
          rad_proiz_armiraci_km_kg?: number | null
          rad_proiz_betonirci_km_m3?: number | null
          rad_proiz_kalupari_km_m3?: number | null
          rad_proiz_sanacija_km_m3?: number | null
          rad_static_km_m3?: number | null
          rad_static_suplje_km_m2?: number | null
          rad_transport_km_m3?: number | null
          status?: string
          tlocrt_objekta_m2?: number | null
          udaljenost_km?: number | null
          ukupna_cijena?: number | null
          ukupno_direktni_troskovi?: number | null
          ukupno_indirektni_troskovi?: number | null
          ukupno_rap_it?: number | null
          updated_at?: string
          user_id: string
          verzija?: string
          zakljucano?: boolean
        }
        Update: {
          bih_broj_dana?: number | null
          bih_broj_radnika?: number | null
          bih_cijena_ishrane_km?: number | null
          bih_cijena_smjestaja_km?: number | null
          bih_terenska_dnevnica_km?: number | null
          bih_ukupno_km?: number | null
          cijena_po_m2?: number | null
          created_at?: string
          datum_kalkulacije?: string
          datum_zakljucanja?: string | null
          drzava?: string
          id?: string
          ind_administracija?: number | null
          ind_amortizacija?: number | null
          ind_biro?: number | null
          ind_elektricna_energija?: number | null
          ind_odrzavanje_fabrike?: number | null
          ind_prodaja?: number | null
          ind_tehnicka_priprema?: number | null
          ino_broj_dana?: number | null
          ino_broj_radnika?: number | null
          ino_cijena_ishrane_km?: number | null
          ino_cijena_smjestaja_km?: number | null
          ino_terenska_dnevnica_km?: number | null
          ino_ukupno_km?: number | null
          mat_mont_km_m3?: number | null
          mjesto_gradnje?: string
          objekat?: string
          ponuda?: string | null
          povrsina_objekta_m2?: number | null
          rad_mont_montazna_km_m3?: number | null
          rad_mont_suplje_ploce_km_m2?: number | null
          rad_proiz_armiraci_km_kg?: number | null
          rad_proiz_betonirci_km_m3?: number | null
          rad_proiz_kalupari_km_m3?: number | null
          rad_proiz_sanacija_km_m3?: number | null
          rad_static_km_m3?: number | null
          rad_static_suplje_km_m2?: number | null
          rad_transport_km_m3?: number | null
          status?: string
          tlocrt_objekta_m2?: number | null
          udaljenost_km?: number | null
          ukupna_cijena?: number | null
          ukupno_direktni_troskovi?: number | null
          ukupno_indirektni_troskovi?: number | null
          ukupno_rap_it?: number | null
          updated_at?: string
          user_id?: string
          verzija?: string
          zakljucano?: boolean
        }
        Relationships: []
      }
      materijal: {
        Row: {
          cijena_km: number | null
          created_at: string
          id: string
          imel_sifra: string | null
          jedinica_mjere: string
          naziv_materijala: string
        }
        Insert: {
          cijena_km?: number | null
          created_at?: string
          id?: string
          imel_sifra?: string | null
          jedinica_mjere?: string
          naziv_materijala: string
        }
        Update: {
          cijena_km?: number | null
          created_at?: string
          id?: string
          imel_sifra?: string | null
          jedinica_mjere?: string
          naziv_materijala?: string
        }
        Relationships: []
      }
      materijal_po_elementu: {
        Row: {
          created_at: string
          id: string
          kolicina_po_elementu: number | null
          materijal_id: string
          tip_elementa_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kolicina_po_elementu?: number | null
          materijal_id: string
          tip_elementa_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kolicina_po_elementu?: number | null
          materijal_id?: string
          tip_elementa_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "materijal_po_elementu_materijal_id_fkey"
            columns: ["materijal_id"]
            isOneToOne: false
            referencedRelation: "materijal"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materijal_po_elementu_tip_elementa_id_fkey"
            columns: ["tip_elementa_id"]
            isOneToOne: false
            referencedRelation: "tip_elementa"
            referencedColumns: ["id"]
          },
        ]
      }
      parametar_elementa: {
        Row: {
          armatura_kg_m3: number | null
          armatura_koeficijent: number | null
          beton_km_m3: number | null
          created_at: string
          id: string
          kablovi_kg_m3: number | null
          kablovi_km_kg: number | null
          marka_betona: string
          ostalo_postotak: number | null
          tip_elementa_id: string | null
        }
        Insert: {
          armatura_kg_m3?: number | null
          armatura_koeficijent?: number | null
          beton_km_m3?: number | null
          created_at?: string
          id?: string
          kablovi_kg_m3?: number | null
          kablovi_km_kg?: number | null
          marka_betona?: string
          ostalo_postotak?: number | null
          tip_elementa_id?: string | null
        }
        Update: {
          armatura_kg_m3?: number | null
          armatura_koeficijent?: number | null
          beton_km_m3?: number | null
          created_at?: string
          id?: string
          kablovi_kg_m3?: number | null
          kablovi_km_kg?: number | null
          marka_betona?: string
          ostalo_postotak?: number | null
          tip_elementa_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parametar_elementa_tip_elementa_id_fkey"
            columns: ["tip_elementa_id"]
            isOneToOne: false
            referencedRelation: "tip_elementa"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          ime: string | null
          prezime: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          ime?: string | null
          prezime?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          ime?: string | null
          prezime?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tip_elementa: {
        Row: {
          created_at: string
          dimenzije: string | null
          id: string
          kategorija: string | null
          napomena: string | null
          naziv_tipa: string
          redoslijed: number | null
        }
        Insert: {
          created_at?: string
          dimenzije?: string | null
          id?: string
          kategorija?: string | null
          napomena?: string | null
          naziv_tipa: string
          redoslijed?: number | null
        }
        Update: {
          created_at?: string
          dimenzije?: string | null
          id?: string
          kategorija?: string | null
          napomena?: string | null
          naziv_tipa?: string
          redoslijed?: number | null
        }
        Relationships: []
      }
      transport_kalkulacije: {
        Row: {
          broj_tura: number | null
          cijena_po_m3: number | null
          created_at: string
          id: string
          kalkulacija_id: string
          tip_ture: string
          udaljenost_km: number | null
          ukupna_cijena_km: number | null
        }
        Insert: {
          broj_tura?: number | null
          cijena_po_m3?: number | null
          created_at?: string
          id?: string
          kalkulacija_id: string
          tip_ture?: string
          udaljenost_km?: number | null
          ukupna_cijena_km?: number | null
        }
        Update: {
          broj_tura?: number | null
          cijena_po_m3?: number | null
          created_at?: string
          id?: string
          kalkulacija_id?: string
          tip_ture?: string
          udaljenost_km?: number | null
          ukupna_cijena_km?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transport_kalkulacije_kalkulacija_id_fkey"
            columns: ["kalkulacija_id"]
            isOneToOne: false
            referencedRelation: "kalkulacije"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
