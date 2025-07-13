import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) { throw new Error('Missing supabase environment variables, ensure SUPABASE_URL and SUPABASE_ANON_KEY are set for this machine') }

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
