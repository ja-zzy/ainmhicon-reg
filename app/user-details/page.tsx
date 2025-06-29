"use client"
import { FormEventHandler, useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import { Attendee } from '../utils/types'
import ErrorMessage from '../components/errorMessage'
import { useRouter } from 'next/navigation'
import Loading from '../components/loading'

export default function UserDetailsPage() {
    const router = useRouter()
    const [attendee, setAttendee] = useState<Attendee>({ first_name: '', last_name: '', phone: '', pronouns: '' })
    const [attendeeExists, setAttendeeExists] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>()
    const [userId, setUserId] = useState<string | null>()


    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            const currentUser = session?.user || null
            if (!currentUser) {
                router.push('/login')
                return
            }
            setUserId(currentUser.id)


            const { data, error } = await supabase
                .from('attendees')
                .select('*')
                .eq('user_id', currentUser.id)
                .single()

            if (data) {
                setAttendee(data)
            }
            setAttendeeExists(data)
        }
        init()
    }, [])

    const handleUpdate: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        if (loading) { return }
        setLoading(true)
        setError(null)

        // The user already completed sign up, they're just updating details
        if (attendeeExists) {
            const { error } = await supabase
                .from('attendees')
                .update({ ...attendee })
                .eq('user_id', userId)
            if (error) {
                setError(error.message)
            } else {
                router.push('/dashboard')
                return
            }
        } else {
            if (!userId) {
                setError('Tried to update user without a user id!')
                return
            }
            const { error } = await supabase
                .from('attendees')
                .insert([
                    {
                        user_id: userId,
                        ...attendee
                    }
                ])
            if (error) {
                setError(error.message)
            } else {
                router.push('/dashboard')
                return
            }
        }
        setLoading(false)
    }

    return (
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 pt-18 shadow-lg">
            {loading && <Loading />}
            {!loading && (
                <form onSubmit={handleUpdate} className='p-2'>
                    <p className='m-3 ms-0 me-0'>Let us know all about you!</p>
                    <label className="label">First Name</label>
                    <input type="text" className="input" placeholder="Ceol" value={attendee.first_name}
                        onChange={(e) => setAttendee({ ...attendee, first_name: e.target.value })}
                        required disabled={loading} />
                    <label className="label">Last Name</label>
                    <input type="text" className="input" placeholder="Púcas" value={attendee.last_name}
                        onChange={(e) => setAttendee({ ...attendee, last_name: e.target.value })}
                        required disabled={loading} />
                    <label className="label">Contact Number</label>
                    <input type="text" className="input" placeholder="089 011 0123" value={attendee.phone}
                        onChange={(e) => setAttendee({ ...attendee, phone: e.target.value })}
                        required disabled={loading} />
                    <label className="label">Pronouns</label>
                    <input type="text" className="input" placeholder="Optional" value={attendee.pronouns}
                        onChange={(e) => setAttendee({ ...attendee, pronouns: e.target.value })}
                        disabled={loading} />
                    <ErrorMessage error={error} />
                    <button type="submit" className="btn btn-neutral mt-4 w-full" disabled={loading}>{loading && <span className="loading loading-ring loading-md"></span>}{!loading && <>Update my info</>}</button>
                </form>
            )}
        </fieldset>
    )
}