import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

// This is NOT SAFE to be exposed to the client. Please contact the maintainer _immediately_ if this is leaked and we can regenerate it.
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) { throw new Error('Missing supabase environment variables, ensure SUPABASE_URL and SUPABASE_SERVICE_KEY are set for this machine') }

export const supabase = createClient(supabaseUrl, supabaseServiceKey)