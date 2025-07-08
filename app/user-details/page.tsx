"use client"
import { ChangeEventHandler, FormEventHandler, MouseEventHandler, useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import { Attendee } from '../utils/types'
import ErrorMessage from '../components/errorMessage'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/authContext'
import { AuthWrapper } from '../components/authWrapper'
import Loading from '../components/loading'

export default function UserDetailsPage() {
    const [error, setError] = useState<string | null>()
    const { attendee, user, updateProfile } = useAuth()
    const [tempAttendee, setTempAttendee] = useState<Attendee>(attendee || { first_name: '', last_name: '', phone: '', pronouns: '' })
    const [userProfilePic, setUserProfilePic] = useState<'loading' | string | undefined>('loading')
    const [updatePending, setUpdatePending] = useState(false)

    const router = useRouter()
    useEffect(() => {
        if (attendee) {
            setTempAttendee(attendee)
        }
    }, [attendee])

    const refreshPicture = async (userId: string) => {
        const filePath = `${userId}/profile_picture`
        const { data } = await supabase
            .storage
            .from('attendee-badge-images')
            .createSignedUrl(filePath, 60 * 60)
        setUserProfilePic(data?.signedUrl)
    }

    useEffect(() => {
        if (user) {
            refreshPicture(user.id)
        }
    }, [user])

    const handleUpdate: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        setError(null)
        setUpdatePending(true)
        updateProfile(tempAttendee)
            .then(() => router.push('/dashboard'))
            .catch((e) => setError(e.message))
    }

    const imageChangeHandler: ChangeEventHandler<HTMLInputElement> = async (e) => {
        if (!user?.id) { return }
        const file = e.target?.files?.[0]
        if (!file) return

        const filePath = `${user.id}/profile_picture`
        const { error } = await supabase
            .storage
            .from('attendee-badge-images')
            .upload(filePath, file, { upsert: true })

        if (error) { setError(error.message) }
        else { refreshPicture(user.id) }
    }

    function navigateBack() {
        router.push('/dashboard')
    }

    return (
        <AuthWrapper requireAuth={true} allowIncompleteProfile={true}>
            {updatePending && <Loading />}
            {!updatePending && (
                <form onSubmit={handleUpdate} className='p-2'>
                    <h2 className='font-[family-name:var(--font-sora)] text-xl mb-3'>Your Details</h2>
                    <div className={`avatar flex flex-col justify-center me-3 min-h-[96px] ${userProfilePic === 'loading' || !userProfilePic ? 'avatar-placeholder' : ''}`}>
                        <label htmlFor='profile-picture' className={`w-24 rounded-full m-auto cursor-pointer relative group overflow-hidden text-black ${userProfilePic === 'loading' || !userProfilePic ? 'bg-base-100' : ''}`}>
                            {userProfilePic === 'loading' && <Loading />}
                            {!userProfilePic && <div className="text-l w-[96px] h-[96px] flex justify-center items-center text-center">No Badge!</div>}
                            {userProfilePic && userProfilePic !== 'loading' && <img src={userProfilePic} className='aspect-square' />}
                            <div className='absolute top-[100%] w-[100%] h-[100%] text-center bg-neutral/30 transition-all duration-150 ease-out backdrop-blur-xs text-white flex items-center justify-center  group-hover:top-[0%]'>
                                <i className=''>Change<br />Picture</i>
                            </div>
                        </label>
                        <input onChange={imageChangeHandler} type='file' accept='image/png, image/jpeg' id='profile-picture' className='hidden' />
                    </div>
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
                    <button type="submit" className="btn btn-neutral mt-4 w-full">Update</button>
                    <button type="button" onClick={navigateBack} className="btn btn-neutral mt-4 w-full">Cancel</button>
                </form>
            )}
        </AuthWrapper >
    )
}