/**
 * Tipos gerados para o Supabase Database
 */

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
          name: string | null
          email: string | null
          avatar_url: string | null
          monthly_income: number
          monthly_budget: number
          currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          email?: string | null
          avatar_url?: string | null
          monthly_income?: number
          monthly_budget?: number
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          avatar_url?: string | null
          monthly_income?: number
          monthly_budget?: number
          currency?: string
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          user_id: string | null
          name: string
          icon: string
          color: string
          type: 'expense' | 'income'
          is_system: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          icon?: string
          color?: string
          type: 'expense' | 'income'
          is_system?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          icon?: string
          color?: string
          type?: 'expense' | 'income'
          is_system?: boolean
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          category_id: string | null
          amount: number
          type: 'expense' | 'income'
          description: string | null
          date: string
          notes: string | null
          is_installment: boolean
          installment_number: number | null
          total_installments: number | null
          installment_group_id: string | null
          is_recurring: boolean
          recurring_type: 'daily' | 'weekly' | 'monthly' | 'yearly' | null
          recurring_end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id?: string | null
          amount: number
          type: 'expense' | 'income'
          description?: string | null
          date?: string
          notes?: string | null
          is_installment?: boolean
          installment_number?: number | null
          total_installments?: number | null
          installment_group_id?: string | null
          is_recurring?: boolean
          recurring_type?: 'daily' | 'weekly' | 'monthly' | 'yearly' | null
          recurring_end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string | null
          amount?: number
          type?: 'expense' | 'income'
          description?: string | null
          date?: string
          notes?: string | null
          is_installment?: boolean
          installment_number?: number | null
          total_installments?: number | null
          installment_group_id?: string | null
          is_recurring?: boolean
          recurring_type?: 'daily' | 'weekly' | 'monthly' | 'yearly' | null
          recurring_end_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      budgets: {
        Row: {
          id: string
          user_id: string
          category_id: string | null
          amount: number
          period: 'monthly' | 'weekly'
          month: number | null
          year: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id?: string | null
          amount: number
          period?: 'monthly' | 'weekly'
          month?: number | null
          year?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string | null
          amount?: number
          period?: 'monthly' | 'weekly'
          month?: number | null
          year?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          name: string
          target_amount: number
          current_amount: number
          deadline: string | null
          icon: string
          color: string
          is_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          target_amount: number
          current_amount?: number
          deadline?: string | null
          icon?: string
          color?: string
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          target_amount?: number
          current_amount?: number
          deadline?: string | null
          icon?: string
          color?: string
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      monthly_category_summary: {
        Row: {
          user_id: string
          month: string
          category_id: string
          category_name: string
          category_color: string
          type: 'expense' | 'income'
          total_amount: number
          transaction_count: number
        }
      }
      monthly_balance: {
        Row: {
          user_id: string
          month: string
          total_income: number
          total_expenses: number
          balance: number
        }
      }
    }
    Functions: {}
    Enums: {}
  }
}
