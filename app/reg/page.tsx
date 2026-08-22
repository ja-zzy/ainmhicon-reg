"use client"

import { useRouter } from 'next/navigation'
import { useAuth } from '../context/authContext'
import { AuthWrapper } from '../components/authWrapper'
import { RegView } from './view'
import { useEffect, useState } from 'react'
import { getTicketStock, getActiveCheckoutSession } from '../utils/public/stripe'
import Loading from '../components/loading'

export default function UserDetailsPage() {
    const { user, attendee } = useAuth()
    const router = useRouter()
    const redirect = () => router.push('/dashboard')
    const [ticketData, setTicketData] = useState<Set<number>>(new Set())
    const [activeCheckoutSession, setActiveCheckoutSession] = useState<string>()
    const [loading, setLoading] = useState(true)
    const step = window.location.hash === '#confirmation' ? 3 : 0
    useEffect(() => {
        const load = async () => {
            if (!user) { return }
            const activeCheckout = await getActiveCheckoutSession(user.id)
            if (!activeCheckout) {
                const ticketData = await getTicketStock()
                setTicketData(ticketData)
            } else {
                setActiveCheckoutSession(activeCheckout)
            }
            setLoading(false)
        }
        if (step !== 3) {
            load()
        } else {
            setLoading(false)
        }

    }, [user])

    return (
        <AuthWrapper requireAuth={true} allowIncompleteProfile={true}>
            {
                loading
                    ? <Loading />
                    : <RegView user={user} attendee={attendee} onRedirect={redirect} startingStep={step} ticketData={ticketData} activeCheckoutSession={activeCheckoutSession} />
            }
        </AuthWrapper >
    )
}
