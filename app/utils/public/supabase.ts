import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) { throw new Error('Missing supabase environment variables, ensure SUPABASE_URL and SUPABASE_ANON_KEY are set for this machine') }

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getHotelCode() {
    const res = await fetch('/api/get-hotel-code', { method: 'GET' });

    if (res.status !== 200) { throw new Error(res.statusText) }

    const { hotelCode } = await res.json();
    return hotelCode;
}