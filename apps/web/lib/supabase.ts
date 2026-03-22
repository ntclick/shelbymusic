import { createClient, SupabaseClient } from '@supabase/supabase-js'

let globalSupabase: SupabaseClient | null = null
let globalSupabaseAdmin: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase client cannot be initialized: missing environment variables.')
  }

  if (!globalSupabase) {
    globalSupabase = createClient(supabaseUrl, supabaseAnonKey)
  }
  return globalSupabase
}

export function getSupabaseAdminClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase admin client cannot be initialized: missing environment variables.')
  }

  if (!globalSupabaseAdmin) {
    globalSupabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      global: {
        // Disable Next.js 14 data cache for all Supabase requests.
        // Without this, Next.js caches Supabase fetch() calls and the
        // status route returns stale 'processing' even after completion.
        fetch: (url, init) => fetch(url, { ...init, cache: 'no-store' }),
      },
    })
  }
  return globalSupabaseAdmin
}
