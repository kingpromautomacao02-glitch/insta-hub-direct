export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      keywords: {
        Row: {
          id: string
          user_id: string
          word: string
          enabled: boolean
          link: string
          message: string
          button_text: string
          triggers_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          word: string
          enabled?: boolean
          link: string
          message?: string
          button_text?: string
          triggers_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          word?: string
          enabled?: boolean
          link?: string
          message?: string
          button_text?: string
          triggers_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      automation_configs: {
        Row: {
          id: string
          user_id: string
          access_token: string
          instagram_id: string
          base_url: string
          api_key: string
          delay_seconds: number
          reply_to_comment: boolean
          send_dm: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          access_token?: string
          instagram_id?: string
          base_url?: string
          api_key?: string
          delay_seconds?: number
          reply_to_comment?: boolean
          send_dm?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          access_token?: string
          instagram_id?: string
          base_url?: string
          api_key?: string
          delay_seconds?: number
          reply_to_comment?: boolean
          send_dm?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
