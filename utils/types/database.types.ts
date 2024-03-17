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
      match: {
        Row: {
          created_at: string
          end_at: string | null
          id: string
          last_msg: string | null
          member_one_avatar: string | null
          member_one_id: string
          member_one_unread: number
          member_two_avatar: string | null
          member_two_id: string
          member_two_unread: number
          msg_num: number
          updated_at: string | null
          username_one: string | null
          username_two: string | null
        }
        Insert: {
          created_at?: string
          end_at?: string | null
          id?: string
          last_msg?: string | null
          member_one_avatar?: string | null
          member_one_id: string
          member_one_unread?: number
          member_two_avatar?: string | null
          member_two_id: string
          member_two_unread?: number
          msg_num?: number
          updated_at?: string | null
          username_one?: string | null
          username_two?: string | null
        }
        Update: {
          created_at?: string
          end_at?: string | null
          id?: string
          last_msg?: string | null
          member_one_avatar?: string | null
          member_one_id?: string
          member_one_unread?: number
          member_two_avatar?: string | null
          member_two_id?: string
          member_two_unread?: number
          msg_num?: number
          updated_at?: string | null
          username_one?: string | null
          username_two?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_member_one_id_fkey"
            columns: ["member_one_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_member_two_id_fkey"
            columns: ["member_two_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      message: {
        Row: {
          content: string
          created_at: string
          deleted: boolean
          file_url: string | null
          id: string
          match_id: string
          member_id: string
          updated_at: string | null
          visible_to: string | null
        }
        Insert: {
          content: string
          created_at?: string
          deleted?: boolean
          file_url?: string | null
          id?: string
          match_id: string
          member_id: string
          updated_at?: string | null
          visible_to?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          deleted?: boolean
          file_url?: string | null
          id?: string
          match_id?: string
          member_id?: string
          updated_at?: string | null
          visible_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "match"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      preference: {
        Row: {
          age: number | null
          education: string | null
          height_inches: number | null
          hobbies: string[] | null
          id: string
          location: number | null
          mbti: string | null
          race: string | null
          religion: string | null
          user_id: string
          work: string | null
          zodiac: number | null
        }
        Insert: {
          age?: number | null
          education?: string | null
          height_inches?: number | null
          hobbies?: string[] | null
          id?: string
          location?: number | null
          mbti?: string | null
          race?: string | null
          religion?: string | null
          user_id: string
          work?: string | null
          zodiac?: number | null
        }
        Update: {
          age?: number | null
          education?: string | null
          height_inches?: number | null
          hobbies?: string[] | null
          id?: string
          location?: number | null
          mbti?: string | null
          race?: string | null
          religion?: string | null
          user_id?: string
          work?: string | null
          zodiac?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "preference_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          about_me: string | null
          avatar_url: string | null
          birthday: string | null
          created_at: string | null
          education: string | null
          email: string | null
          full_name: string | null
          gender: string | null
          hobbies: string[] | null
          id: string
          instagram_url: string | null
          introduction: string | null
          last_matching: string | null
          location: unknown | null
          mbti: string | null
          personalities: string[] | null
          preference: string | null
          profile_pic: string[] | null
          prompt: string | null
          push_token: string | null
          race: string | null
          religion: string | null
          role: Database["public"]["Enums"]["user_role"]
          status: string | null
          updated_at: string | null
          username: string | null
          work: string | null
          zodiac: string | null
        }
        Insert: {
          about_me?: string | null
          avatar_url?: string | null
          birthday?: string | null
          created_at?: string | null
          education?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          hobbies?: string[] | null
          id: string
          instagram_url?: string | null
          introduction?: string | null
          last_matching?: string | null
          location?: unknown | null
          mbti?: string | null
          personalities?: string[] | null
          preference?: string | null
          profile_pic?: string[] | null
          prompt?: string | null
          push_token?: string | null
          race?: string | null
          religion?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: string | null
          updated_at?: string | null
          username?: string | null
          work?: string | null
          zodiac?: string | null
        }
        Update: {
          about_me?: string | null
          avatar_url?: string | null
          birthday?: string | null
          created_at?: string | null
          education?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          hobbies?: string[] | null
          id?: string
          instagram_url?: string | null
          introduction?: string | null
          last_matching?: string | null
          location?: unknown | null
          mbti?: string | null
          personalities?: string[] | null
          preference?: string | null
          profile_pic?: string[] | null
          prompt?: string | null
          push_token?: string | null
          race?: string | null
          religion?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: string | null
          updated_at?: string | null
          username?: string | null
          work?: string | null
          zodiac?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      find_match: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["CompositeTypes"]["matching_profile"]
      }
      find_match_by_user: {
        Args: {
          userid: string
        }
        Returns: Database["public"]["CompositeTypes"]["matching_profile"]
      }
      find_match_two_users: {
        Args: {
          userone: string
          usertwo: string
        }
        Returns: Database["public"]["CompositeTypes"]["matching_profile"]
      }
      get_current_match: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["CompositeTypes"]["current_match"]
      }
      get_user_matches: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          created_at: string
          member_id: string
          unread: number
          member_avatar: string
          last_msg: string
          updated_at: string
          msg_num: number
          end_at: string
          username: string
        }[]
      }
      is_match_member: {
        Args: {
          member_id: string
          match_id: string
        }
        Returns: boolean
      }
      test_func: {
        Args: {
          userid: string
        }
        Returns: string
      }
      unmatch: {
        Args: {
          match_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      status_type: "free" | "pending" | "matching" | "matched"
      user_role: "user" | "membership"
    }
    CompositeTypes: {
      current_match: {
        match_id: string
        member_id: string
        username: string
        avatar_url: string
        age: number
        gender: string
        mbti: string
        dist_meters: number
        introduction: string
        personalities: unknown
        hobbies: unknown
      }
      matching_profile: {
        id: string
        username: string
        avatar_url: string
        age: number
        gender: string
        mbti: string
        dist_meters: number
      }
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
