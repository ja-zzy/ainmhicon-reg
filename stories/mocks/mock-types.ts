import { Attendee, Registration } from "@/app/utils/types"
import { User } from "@supabase/supabase-js"

export const defaultMockUser: User = {
    id: '12345',
    app_metadata: {},
    user_metadata: {},
    aud: '',
    created_at: '',
}

export const defaultMockAttendee: Attendee = {
    first_name: 'Ainmhícon',
    last_name: 'Enjoyer',
    pronouns: 'They/Them',
    phone: '0831111111',
    dob: '01/01/1970',
    nickname: 'Ainmhí',
    emergency_contact_name: 'Ceol',
    emergency_contact_phone: '0832222222',
    medical_info: 'N/A',
    fursuit: 'Yes'
}

export const defaultRegistration: Registration = {
    ticket_type: 'Ainmhícon 2026 - Weekend Standard Ticket',
    payment_status: 'paid',
    badge_id: 12345
}