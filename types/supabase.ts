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
    PostgrestVersion: "14.4"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      medecins_delegants: {
        Row: {
          actif: boolean
          created_at: string
          id: string
          nom: string
          prenom: string
          rpps: string
          updated_at: string
        }
        Insert: {
          actif?: boolean
          created_at?: string
          id?: string
          nom: string
          prenom: string
          rpps: string
          updated_at?: string
        }
        Update: {
          actif?: boolean
          created_at?: string
          id?: string
          nom?: string
          prenom?: string
          rpps?: string
          updated_at?: string
        }
        Relationships: []
      }
      pharmacies: {
        Row: {
          adresse: string | null
          created_at: string
          finess: string
          id: string
          nom: string
          updated_at: string
        }
        Insert: {
          adresse?: string | null
          created_at?: string
          finess: string
          id?: string
          nom: string
          updated_at?: string
        }
        Update: {
          adresse?: string | null
          created_at?: string
          finess?: string
          id?: string
          nom?: string
          updated_at?: string
        }
        Relationships: []
      }
      pmo_entries: {
        Row: {
          created_at: string
          date_realisation: string
          dispensation_conseil: boolean
          effet_indesirable: string | null
          id: string
          medecin_delegant_nom: string
          medecin_delegant_rpps: string
          nb_produits_conseil: string
          nb_produits_pmo: string
          orientation: string
          patient_age: string
          patient_medecin_traitant: boolean
          patient_sexe: string
          pharmacie_id: string
          prescription_anti_h1: boolean
          prescription_antiallergique_nasal: boolean
          prescription_collyre: boolean
          prescription_corticoide_nasal: boolean
          renouvellement: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_realisation: string
          dispensation_conseil: boolean
          effet_indesirable?: string | null
          id?: string
          medecin_delegant_nom: string
          medecin_delegant_rpps: string
          nb_produits_conseil: string
          nb_produits_pmo: string
          orientation: string
          patient_age: string
          patient_medecin_traitant: boolean
          patient_sexe: string
          pharmacie_id: string
          prescription_anti_h1: boolean
          prescription_antiallergique_nasal: boolean
          prescription_collyre: boolean
          prescription_corticoide_nasal: boolean
          renouvellement?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_realisation?: string
          dispensation_conseil?: boolean
          effet_indesirable?: string | null
          id?: string
          medecin_delegant_nom?: string
          medecin_delegant_rpps?: string
          nb_produits_conseil?: string
          nb_produits_pmo?: string
          orientation?: string
          patient_age?: string
          patient_medecin_traitant?: boolean
          patient_sexe?: string
          pharmacie_id?: string
          prescription_anti_h1?: boolean
          prescription_antiallergique_nasal?: boolean
          prescription_collyre?: boolean
          prescription_corticoide_nasal?: boolean
          renouvellement?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pmo_entries_pharmacie_id_fkey"
            columns: ["pharmacie_id"]
            isOneToOne: false
            referencedRelation: "pharmacies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          pharmacie_id: string | null
          role: string
          rpps: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          pharmacie_id?: string | null
          role?: string
          rpps?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          pharmacie_id?: string | null
          role?: string
          rpps?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_pharmacie_id_fkey"
            columns: ["pharmacie_id"]
            isOneToOne: false
            referencedRelation: "pharmacies"
            referencedColumns: ["id"]
          },
        ]
      }
      satisfaction_patient: {
        Row: {
          commentaire: string | null
          conseils_aide: number
          consultation_medecin_apres: boolean
          created_at: string
          facilite_vie: number
          id: string
          raison_consultation: string | null
          raison_venue: string
          raison_venue_autre: string | null
          satisfaction_prise_en_charge: number
          souhait_renouvellement: boolean
          updated_at: string
        }
        Insert: {
          commentaire?: string | null
          conseils_aide: number
          consultation_medecin_apres: boolean
          created_at?: string
          facilite_vie: number
          id?: string
          raison_consultation?: string | null
          raison_venue: string
          raison_venue_autre?: string | null
          satisfaction_prise_en_charge: number
          souhait_renouvellement: boolean
          updated_at?: string
        }
        Update: {
          commentaire?: string | null
          conseils_aide?: number
          consultation_medecin_apres?: boolean
          created_at?: string
          facilite_vie?: number
          id?: string
          raison_consultation?: string | null
          raison_venue?: string
          raison_venue_autre?: string | null
          satisfaction_prise_en_charge?: number
          souhait_renouvellement?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      satisfaction_pharmacien: {
        Row: {
          acces_soins: number
          annee_reference: number
          appreciation_patients: number
          autres_incidents: boolean
          benefice_pratique: number
          commentaire: string | null
          created_at: string
          facilite_mise_en_place: number
          id: string
          incidents_description: string | null
          nb_effets_indesirables_graves: number
          pharmacie_id: string
          satisfaction_globale: number
          updated_at: string
          user_id: string
        }
        Insert: {
          acces_soins: number
          annee_reference?: number
          appreciation_patients: number
          autres_incidents: boolean
          benefice_pratique: number
          commentaire?: string | null
          created_at?: string
          facilite_mise_en_place: number
          id?: string
          incidents_description?: string | null
          nb_effets_indesirables_graves: number
          pharmacie_id: string
          satisfaction_globale: number
          updated_at?: string
          user_id: string
        }
        Update: {
          acces_soins?: number
          annee_reference?: number
          appreciation_patients?: number
          autres_incidents?: boolean
          benefice_pratique?: number
          commentaire?: string | null
          created_at?: string
          facilite_mise_en_place?: number
          id?: string
          incidents_description?: string | null
          nb_effets_indesirables_graves?: number
          pharmacie_id?: string
          satisfaction_globale?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "satisfaction_pharmacien_pharmacie_id_fkey"
            columns: ["pharmacie_id"]
            isOneToOne: false
            referencedRelation: "pharmacies"
            referencedColumns: ["id"]
          },
        ]
      }
      tarifs_pso: {
        Row: {
          actif: boolean
          cle: string
          created_at: string
          id: string
          libelle: string
          montant_euros: number
          updated_at: string
        }
        Insert: {
          actif?: boolean
          cle: string
          created_at?: string
          id?: string
          libelle: string
          montant_euros: number
          updated_at?: string
        }
        Update: {
          actif?: boolean
          cle?: string
          created_at?: string
          id?: string
          libelle?: string
          montant_euros?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: { Args: { role_name: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
