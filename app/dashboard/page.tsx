"use client"
import { FormEventHandler, useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import { Attendee } from '../utils/types'
import { useRouter } from 'next/navigation'
import Loading from '../components/loading'

export default function UserDetailsPage() {
    const router = useRouter()
    const [attendee, setAttendee] = useState<Attendee | null>(null)


    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            const user = session?.user || null
            if (!user) {
                router.push('/login')
                return
            }
            const result = await supabase.from('attendees').select('*').eq('user_id', user.id)

            if (!result?.data) {
                router.push('/login')
                return
            }
            const foundDetails = result.data[0]
            setAttendee(foundDetails)
        }
        init()
    }, [])


    return (
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 pt-18 shadow-lg">
            {!attendee && <Loading />}
            {attendee && (
                <>
                    <h3>
                        Welcome back, {attendee.first_name}!
                    </h3>
                    <a href='/user-details'>Update my details</a>
                </>
            )}
        </fieldset>
    )
}