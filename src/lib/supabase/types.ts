
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "appointments": {
                  Row: {
                    "created_at": string,"duration_minutes": number,"id": string,"lead_id": string,"location": string | null,"notes": string | null,"starts_at": string,"status": Database["public"]['Enums']["appointment_status"],"workspace_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"duration_minutes"?: number,"id"?: string,"lead_id": string,"location"?: string | null,"notes"?: string | null,"starts_at": string,"status"?: Database["public"]['Enums']["appointment_status"],"workspace_id": string
                  }
                  Update: {
                    "created_at"?: string,"duration_minutes"?: number,"id"?: string,"lead_id"?: string,"location"?: string | null,"notes"?: string | null,"starts_at"?: string,"status"?: Database["public"]['Enums']["appointment_status"],"workspace_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "appointments_lead_id_fkey"
      columns: ["lead_id"]
isOneToOne: false
      referencedRelation: "leads"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "appointments_workspace_id_fkey"
      columns: ["workspace_id"]
isOneToOne: false
      referencedRelation: "workspaces"
      referencedColumns: ["id"]
    }
                  ]
                },"automations": {
                  Row: {
                    "channel": Database["public"]['Enums']["channel"],"created_at": string,"delay_minutes": number,"id": string,"is_active": boolean,"name": string,"requires_approval": boolean,"template_id": string,"trigger": Database["public"]['Enums']["automation_trigger"],"workspace_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "channel"?: Database["public"]['Enums']["channel"],"created_at"?: string,"delay_minutes"?: number,"id"?: string,"is_active"?: boolean,"name": string,"requires_approval"?: boolean,"template_id": string,"trigger": Database["public"]['Enums']["automation_trigger"],"workspace_id": string
                  }
                  Update: {
                    "channel"?: Database["public"]['Enums']["channel"],"created_at"?: string,"delay_minutes"?: number,"id"?: string,"is_active"?: boolean,"name"?: string,"requires_approval"?: boolean,"template_id"?: string,"trigger"?: Database["public"]['Enums']["automation_trigger"],"workspace_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "automations_template_id_fkey"
      columns: ["template_id"]
isOneToOne: false
      referencedRelation: "message_templates"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "automations_workspace_id_fkey"
      columns: ["workspace_id"]
isOneToOne: false
      referencedRelation: "workspaces"
      referencedColumns: ["id"]
    }
                  ]
                },"contact_requests": {
                  Row: {
                    "company": string | null,"created_at": string,"email": string,"full_name": string,"id": string,"locale": string,"message": string
                  }
                  ComputedFields: never
                  Insert: {
                    "company"?: string | null,"created_at"?: string,"email": string,"full_name": string,"id"?: string,"locale": string,"message": string
                  }
                  Update: {
                    "company"?: string | null,"created_at"?: string,"email"?: string,"full_name"?: string,"id"?: string,"locale"?: string,"message"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "contact_requests_locale_fkey"
      columns: ["locale"]
isOneToOne: false
      referencedRelation: "locales"
      referencedColumns: ["code"]
    }
                  ]
                },"conversations": {
                  Row: {
                    "channel": Database["public"]['Enums']["channel"],"created_at": string,"id": string,"lead_id": string,"locale": string | null,"workspace_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "channel"?: Database["public"]['Enums']["channel"],"created_at"?: string,"id"?: string,"lead_id": string,"locale"?: string | null,"workspace_id": string
                  }
                  Update: {
                    "channel"?: Database["public"]['Enums']["channel"],"created_at"?: string,"id"?: string,"lead_id"?: string,"locale"?: string | null,"workspace_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "conversations_lead_id_fkey"
      columns: ["lead_id"]
isOneToOne: false
      referencedRelation: "leads"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "conversations_locale_fkey"
      columns: ["locale"]
isOneToOne: false
      referencedRelation: "locales"
      referencedColumns: ["code"]
    },{
      foreignKeyName: "conversations_workspace_id_fkey"
      columns: ["workspace_id"]
isOneToOne: false
      referencedRelation: "workspaces"
      referencedColumns: ["id"]
    }
                  ]
                },"leads": {
                  Row: {
                    "company": string | null,"created_at": string,"email": string | null,"full_name": string,"id": string,"notes": string | null,"phone": string | null,"preferred_locale": string | null,"source": Database["public"]['Enums']["lead_source"],"status": Database["public"]['Enums']["lead_status"],"updated_at": string,"value_cents": number | null,"workspace_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "company"?: string | null,"created_at"?: string,"email"?: string | null,"full_name": string,"id"?: string,"notes"?: string | null,"phone"?: string | null,"preferred_locale"?: string | null,"source"?: Database["public"]['Enums']["lead_source"],"status"?: Database["public"]['Enums']["lead_status"],"updated_at"?: string,"value_cents"?: number | null,"workspace_id": string
                  }
                  Update: {
                    "company"?: string | null,"created_at"?: string,"email"?: string | null,"full_name"?: string,"id"?: string,"notes"?: string | null,"phone"?: string | null,"preferred_locale"?: string | null,"source"?: Database["public"]['Enums']["lead_source"],"status"?: Database["public"]['Enums']["lead_status"],"updated_at"?: string,"value_cents"?: number | null,"workspace_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "leads_preferred_locale_fkey"
      columns: ["preferred_locale"]
isOneToOne: false
      referencedRelation: "locales"
      referencedColumns: ["code"]
    },{
      foreignKeyName: "leads_workspace_id_fkey"
      columns: ["workspace_id"]
isOneToOne: false
      referencedRelation: "workspaces"
      referencedColumns: ["id"]
    }
                  ]
                },"locales": {
                  Row: {
                    "code": string,"english_name": string,"native_name": string
                  }
                  ComputedFields: never
                  Insert: {
                    "code": string,"english_name": string,"native_name": string
                  }
                  Update: {
                    "code"?: string,"english_name"?: string,"native_name"?: string
                  }
                  Relationships: [
                    
                  ]
                },"message_templates": {
                  Row: {
                    "created_at": string,"id": string,"kind": Database["public"]['Enums']["template_kind"],"name": string,"workspace_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"id"?: string,"kind": Database["public"]['Enums']["template_kind"],"name": string,"workspace_id": string
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"kind"?: Database["public"]['Enums']["template_kind"],"name"?: string,"workspace_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "message_templates_workspace_id_fkey"
      columns: ["workspace_id"]
isOneToOne: false
      referencedRelation: "workspaces"
      referencedColumns: ["id"]
    }
                  ]
                },"message_translations": {
                  Row: {
                    "body": string,"created_at": string,"id": string,"message_id": string,"target_locale": string,"workspace_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "body": string,"created_at"?: string,"id"?: string,"message_id": string,"target_locale": string,"workspace_id": string
                  }
                  Update: {
                    "body"?: string,"created_at"?: string,"id"?: string,"message_id"?: string,"target_locale"?: string,"workspace_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "message_translations_message_id_fkey"
      columns: ["message_id"]
isOneToOne: false
      referencedRelation: "messages"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "message_translations_target_locale_fkey"
      columns: ["target_locale"]
isOneToOne: false
      referencedRelation: "locales"
      referencedColumns: ["code"]
    },{
      foreignKeyName: "message_translations_workspace_id_fkey"
      columns: ["workspace_id"]
isOneToOne: false
      referencedRelation: "workspaces"
      referencedColumns: ["id"]
    }
                  ]
                },"messages": {
                  Row: {
                    "ai_generated": boolean,"author_id": string | null,"automation_id": string | null,"body": string,"conversation_id": string,"created_at": string,"direction": Database["public"]['Enums']["message_direction"],"id": string,"locale": string | null,"status": Database["public"]['Enums']["message_status"],"workspace_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "ai_generated"?: boolean,"author_id"?: string | null,"automation_id"?: string | null,"body": string,"conversation_id": string,"created_at"?: string,"direction": Database["public"]['Enums']["message_direction"],"id"?: string,"locale"?: string | null,"status": Database["public"]['Enums']["message_status"],"workspace_id": string
                  }
                  Update: {
                    "ai_generated"?: boolean,"author_id"?: string | null,"automation_id"?: string | null,"body"?: string,"conversation_id"?: string,"created_at"?: string,"direction"?: Database["public"]['Enums']["message_direction"],"id"?: string,"locale"?: string | null,"status"?: Database["public"]['Enums']["message_status"],"workspace_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "messages_automation_fk"
      columns: ["automation_id"]
isOneToOne: false
      referencedRelation: "automations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "messages_conversation_id_fkey"
      columns: ["conversation_id"]
isOneToOne: false
      referencedRelation: "conversations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "messages_locale_fkey"
      columns: ["locale"]
isOneToOne: false
      referencedRelation: "locales"
      referencedColumns: ["code"]
    },{
      foreignKeyName: "messages_workspace_id_fkey"
      columns: ["workspace_id"]
isOneToOne: false
      referencedRelation: "workspaces"
      referencedColumns: ["id"]
    }
                  ]
                },"newsletter_subscribers": {
                  Row: {
                    "consent_version": string,"consented_at": string,"email": string,"id": string,"locale": string,"unsubscribe_token": string,"unsubscribed_at": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "consent_version": string,"consented_at"?: string,"email": string,"id"?: string,"locale": string,"unsubscribe_token"?: string,"unsubscribed_at"?: string | null
                  }
                  Update: {
                    "consent_version"?: string,"consented_at"?: string,"email"?: string,"id"?: string,"locale"?: string,"unsubscribe_token"?: string,"unsubscribed_at"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "newsletter_subscribers_locale_fkey"
      columns: ["locale"]
isOneToOne: false
      referencedRelation: "locales"
      referencedColumns: ["code"]
    }
                  ]
                },"profiles": {
                  Row: {
                    "created_at": string,"full_name": string | null,"id": string,"terms_accepted_at": string | null,"terms_version": string | null,"ui_locale": string | null,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"full_name"?: string | null,"id": string,"terms_accepted_at"?: string | null,"terms_version"?: string | null,"ui_locale"?: string | null,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"full_name"?: string | null,"id"?: string,"terms_accepted_at"?: string | null,"terms_version"?: string | null,"ui_locale"?: string | null,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "profiles_ui_locale_fkey"
      columns: ["ui_locale"]
isOneToOne: false
      referencedRelation: "locales"
      referencedColumns: ["code"]
    }
                  ]
                },"template_variants": {
                  Row: {
                    "body": string,"id": string,"locale": string,"subject": string | null,"template_id": string,"updated_at": string,"workspace_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "body": string,"id"?: string,"locale": string,"subject"?: string | null,"template_id": string,"updated_at"?: string,"workspace_id": string
                  }
                  Update: {
                    "body"?: string,"id"?: string,"locale"?: string,"subject"?: string | null,"template_id"?: string,"updated_at"?: string,"workspace_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "template_variants_locale_fkey"
      columns: ["locale"]
isOneToOne: false
      referencedRelation: "locales"
      referencedColumns: ["code"]
    },{
      foreignKeyName: "template_variants_template_id_fkey"
      columns: ["template_id"]
isOneToOne: false
      referencedRelation: "message_templates"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "template_variants_workspace_id_fkey"
      columns: ["workspace_id"]
isOneToOne: false
      referencedRelation: "workspaces"
      referencedColumns: ["id"]
    }
                  ]
                },"workspace_members": {
                  Row: {
                    "created_at": string,"role": string,"user_id": string,"workspace_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"role"?: string,"user_id": string,"workspace_id": string
                  }
                  Update: {
                    "created_at"?: string,"role"?: string,"user_id"?: string,"workspace_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "workspace_members_workspace_id_fkey"
      columns: ["workspace_id"]
isOneToOne: false
      referencedRelation: "workspaces"
      referencedColumns: ["id"]
    }
                  ]
                },"workspaces": {
                  Row: {
                    "comm_locales": (string)[],"created_at": string,"created_by": string,"currency": string,"default_comm_locale": string,"id": string,"internal_ai_locale": string | null,"name": string,"timezone": string
                  }
                  ComputedFields: never
                  Insert: {
                    "comm_locales"?: (string)[],"created_at"?: string,"created_by": string,"currency"?: string,"default_comm_locale"?: string,"id"?: string,"internal_ai_locale"?: string | null,"name": string,"timezone"?: string
                  }
                  Update: {
                    "comm_locales"?: (string)[],"created_at"?: string,"created_by"?: string,"currency"?: string,"default_comm_locale"?: string,"id"?: string,"internal_ai_locale"?: string | null,"name"?: string,"timezone"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "workspaces_default_comm_locale_fkey"
      columns: ["default_comm_locale"]
isOneToOne: false
      referencedRelation: "locales"
      referencedColumns: ["code"]
    },{
      foreignKeyName: "workspaces_internal_ai_locale_fkey"
      columns: ["internal_ai_locale"]
isOneToOne: false
      referencedRelation: "locales"
      referencedColumns: ["code"]
    }
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "create_workspace":
{ Args: { "p_comm_locales": (string)[],"p_currency": string,"p_default_comm_locale": string,"p_name": string,"p_timezone": string }; Returns: string
                           },
"is_workspace_admin":
{ Args: { "ws": string }; Returns: boolean
                           },
"is_workspace_member":
{ Args: { "ws": string }; Returns: boolean
                           },
"purge_expired_data":
{ Args: Record<PropertyKey, never>; Returns: undefined
                           },
"subscribe_newsletter":
{ Args: { "p_consent_version": string,"p_email": string,"p_locale": string }; Returns: undefined
                           },
"template_missing_locales":
{ Args: { "p_template": string }; Returns: (string)[]
                           },
"unsubscribe_newsletter":
{ Args: { "p_token": string }; Returns: boolean
                           }
          }
          Enums: {
            "appointment_status": "scheduled"|"completed"|"cancelled"|"no_show","automation_trigger": "lead_created"|"lead_status_changed"|"appointment_booked","channel": "email"|"sms"|"whatsapp"|"web_chat"|"phone","lead_source": "website"|"referral"|"ads"|"social"|"phone"|"email"|"other","lead_status": "new"|"contacted"|"qualified"|"appointment_booked"|"won"|"lost","message_direction": "inbound"|"outbound","message_status": "received"|"draft"|"pending_approval"|"approved"|"sent","template_kind": "initial_contact"|"follow_up"|"appointment_confirmation"|"appointment_reminder"|"rescheduling"|"reactivation"|"internal_notification"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            "appointment_status": ["scheduled", "completed", "cancelled", "no_show"],"automation_trigger": ["lead_created", "lead_status_changed", "appointment_booked"],"channel": ["email", "sms", "whatsapp", "web_chat", "phone"],"lead_source": ["website", "referral", "ads", "social", "phone", "email", "other"],"lead_status": ["new", "contacted", "qualified", "appointment_booked", "won", "lost"],"message_direction": ["inbound", "outbound"],"message_status": ["received", "draft", "pending_approval", "approved", "sent"],"template_kind": ["initial_contact", "follow_up", "appointment_confirmation", "appointment_reminder", "rescheduling", "reactivation", "internal_notification"]
          }
        }
} as const
