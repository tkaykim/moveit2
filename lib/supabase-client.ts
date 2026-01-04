import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vjxnollfggbufpqldxrb.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqeG5vbGxmZ2didWZwcWxkeHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNzc5MTksImV4cCI6MjA4Mjg1MzkxOX0.Un6HMaVOFiknUxr0HXGahVbea0bfcGVXZ0YWX0PuOU0'

export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

