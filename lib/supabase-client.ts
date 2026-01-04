import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vjxnollfggbufpqldxrb.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqeG5vbGxmZ2didWZwcWxkeHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNzc5MTksImV4cCI6MjA4Mjg1MzkxOX0.Un6HMaVOFiknUxr0HXGahVbea0bfcGVXZ0YWX0PuOU0'

// 싱글톤 인스턴스를 저장할 변수
let supabaseInstance: SupabaseClient | null = null

export function createClient() {
  // 이미 인스턴스가 존재하면 재사용
  if (supabaseInstance) {
    return supabaseInstance
  }

  // 첫 번째 호출 시에만 새 인스턴스 생성
  supabaseInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })

  return supabaseInstance
}

