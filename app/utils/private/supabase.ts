import { createClient } from "@supabase/supabase-js"
import { CURRENT_CON_ID } from "../constants"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

// This is NOT SAFE to be exposed to the client. Please contact the maintainer _immediately_ if this is leaked and we can regenerate it.
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) { throw new Error('Missing supabase environment variables, ensure SUPABASE_URL and SUPABASE_SERVICE_KEY are set for this machine') }

export const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function getTicketAvailability() {
    const { data, error } = await supabase
        .from('tickets_remaining')
        .select('day, remaining')
        .eq('convention_id', CURRENT_CON_ID);

    if (error) { throw error }
    if (!data) {
        return [];
    }

    return data
        .filter(ticket => ticket.remaining > 0)
        .map(ticket => ticket.day);
}

export async function removeTicketFromDays(selectedDay: number | null) {
    await supabase.rpc('decrease_ticket_availability', {
        p_convention_id: CURRENT_CON_ID,
        p_day: selectedDay
    })
}

export async function addTicketToDays(selectedDay: number | null) {
    await supabase.rpc('increase_ticket_availability', {
        p_convention_id: CURRENT_CON_ID,
        p_day: selectedDay
    })
}

export async function isUserRegistered(userId: string) {
    return await supabase
        .from('registrations')
        .select('*')
        .eq('user_id', userId)
        .eq('convention_id', CURRENT_CON_ID)
        .maybeSingle()

}

export async function getActiveCheckoutSession(userId: string) {
    const checkoutSession = await supabase
        .from('open_checkout_sessions')
        .select('stripe_session_id')
        .eq('user_id', userId)
        .maybeSingle()

    return checkoutSession.data
}

export async function startUserCheckout(userId: string, stringSessionId: string) {
    await supabase
        .from('open_checkout_sessions')
        .insert({user_id: userId, stripe_session_id: stringSessionId})
}

export async function clearUserCheckout(userId: string) {
    await supabase
        .from('open_checkout_sessions')
        .delete()
        .eq('user_id', userId)
}

export async function getHotelCode(conId: number = CURRENT_CON_ID) {
    const {data, error } = await supabase
        .from("hotel_codes")
        .select("code")
        .eq("convention_id", conId);

    if (error) { throw error }
    if (!data) {
        return [];
    }

    return data;
}