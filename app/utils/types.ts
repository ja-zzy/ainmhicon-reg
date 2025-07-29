export type Attendee = {
    first_name: string
    last_name: string
    pronouns: string
    phone: string
    dob: string
    nickname: string
    emergency_contact_name: string
    emergency_contact_phone: string
    medical_info: string
}

export type Registration = {
    ticket_type: string
    payment_status: string
    badge_id: number
}