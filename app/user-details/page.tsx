"use client"
import { FormEventHandler, useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import { Attendee } from '../utils/types'
import ErrorMessage from '../components/errorMessage'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/authContext'
import { AuthWrapper } from '../components/authWrapper'

export default function UserDetailsPage() {
    const [error, setError] = useState<string | null>()
    const { attendee, updateProfile } = useAuth()
    const [tempAttendee, setTempAttendee] = useState<Attendee>(attendee || { first_name: '', last_name: '', phone: '', pronouns: '' })
    const router = useRouter()
    useEffect(() => { if (attendee) { setTempAttendee(attendee) } }, [attendee])
    const handleUpdate: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        setError(null)
        updateProfile(tempAttendee).then(() => router.push('/dashboard')).catch((e) => setError(e.message))
    }

    return (
        <AuthWrapper requireAuth={true} allowIncompleteProfile={true}>
            <form onSubmit={handleUpdate} className='p-2'>
                <h2 className='font-[family-name:var(--font-sora)] text-xl mb-3'>Your Details</h2>
                <label className="label">First Name</label>
                <input type="text" className="input" placeholder="Ceol" value={tempAttendee?.first_name || ''}
                    onChange={(e) => setTempAttendee({ ...tempAttendee, first_name: e.target.value })}
                    required />
                <label className="label mt-2">Last Name</label>
                <input type="text" className="input" placeholder="Púcas" value={tempAttendee?.last_name || ''}
                    onChange={(e) => setTempAttendee({ ...tempAttendee, last_name: e.target.value })}
                    required />
                <label className="label mt-2">Contact Number</label>
                <input type="text" className="input" placeholder="089 011 0123" value={tempAttendee?.phone || ''}
                    onChange={(e) => setTempAttendee({ ...tempAttendee, phone: e.target.value })}
                    required />
                <label className="label mt-2">Pronouns</label>
                <input type="text" className="input mb-3" placeholder="Optional" value={tempAttendee?.pronouns || ''}
                    onChange={(e) => setTempAttendee({ ...tempAttendee, pronouns: e.target.value })}
                />
                <ErrorMessage error={error} />
                <button type="submit" className="btn btn-neutral mt-4 w-full">Update my info</button>
            </form>
        </AuthWrapper>
    )
}