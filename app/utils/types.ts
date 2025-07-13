export type Attendee = {
    first_name: string
    last_name: string
    pronouns: string
    phone: string
}

export type RegistrationInfo = {
    ticketDay: "saturday" | "sunday" | "weekend"
    ticketTier: "standard" | "sponsor" | "founder"
    nickname: string
    legal_name: string
    date_of_birth: Date
    access_medical_details: string
}