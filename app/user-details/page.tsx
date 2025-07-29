"use client"
import { ChangeEventHandler, FormEventHandler, InvalidEvent, useEffect, useState } from 'react'
import { supabase } from '../utils/public/supabase'
import { Attendee } from '../utils/types'
import ErrorMessage from '../components/errorMessage'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/authContext'
import { AuthWrapper } from '../components/authWrapper'
import Loading from '../components/loading'

export default function UserDetailsPage() {
    const [error, setError] = useState<string | null>()
    const { attendee, user, updateProfile } = useAuth()
    const [tempAttendee, setTempAttendee] = useState<Attendee>(attendee || { first_name: '', last_name: '', phone: '', pronouns: '', dob: '', nickname: '', emergency_contact_name: '', emergency_contact_phone: '', medical_info: '' })
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
        setError('')
        const filePath = `${user.id}/profile_picture`
        const { error } = await supabase
            .storage
            .from('attendee-badge-images')
            .upload(filePath, file, { upsert: true })

        if (error) {
            // @ts-ignore
            if (error.error === "Payload too large") {
                setError("Please select an image under 1MB")
            }
            else {
                setError(error.message)
            }
        } else {
            refreshPicture(user.id)
        }
    }

    function navigateBack() {
        router.push('/dashboard')
    }

    const handleInvalidLegalNameField = (event: InvalidEvent<HTMLInputElement>) => {
        const input = event.target;
        if (!input.value) {
            input.setCustomValidity('Please input your name exactly as it appears on your legal documentation.');
        } else {
            input.setCustomValidity('');
        }
    };


    const handleInvalidDobField = (event: InvalidEvent<HTMLInputElement>) => {
        const input = event.target;
        if (!input.value) {
            input.setCustomValidity('Please input your date of birth exactly as it appears on your legal documentation.');
        } else {
            input.setCustomValidity('');
        }
    };


    const handleInvalidPhoneField = (event: InvalidEvent<HTMLInputElement>) => {
        const input = event.target;
        if (!input.value) {
            input.setCustomValidity('We need a way to contact you in case of emergency');
        } else {
            input.setCustomValidity('');
        }
    };

    const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
        const input = event.currentTarget;
        input.setCustomValidity('');
    };

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

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

                    <div className="divider">Legal Information</div>
                    <label>It's <b>very important</b> this information matches your <u><a href='https://ainmhicon.ie/#faq' target="_blank">Government Issued ID</a></u>. You will not be allowed access to the convention if it does not match, so please double check!</label>
                    <br />
                    <label className="label mt-2">First Name</label>
                    <input type="text" className="input" placeholder="Ceol" value={tempAttendee?.first_name || ''}
                        onChange={(e) => setTempAttendee({ ...tempAttendee, first_name: e.target.value })}
                        onInput={handleInput}
                        onInvalid={handleInvalidLegalNameField}
                        required />
                    <label className="label mt-2">Last Name</label>
                    <input type="text" className="input" placeholder="Púcas" value={tempAttendee?.last_name || ''}
                        onChange={(e) => setTempAttendee({ ...tempAttendee, last_name: e.target.value })}
                        onInput={handleInput}
                        onInvalid={handleInvalidLegalNameField}
                        required />
                    <label className="label mt-2" >Date of Birth</label>
                    <input type="date" className="input" value={tempAttendee?.dob ? formatDate(new Date(tempAttendee.dob)) : ''} required onChange={(e) => setTempAttendee({ ...tempAttendee, dob: new Date(e.target.value).toISOString() })}
                        onInput={handleInput}
                        onInvalid={handleInvalidDobField}
                    ></input>
                    <div className="divider">Additional Information</div>
                    <label className="label">Nickname &#40;Displayed on your badge&#41;</label>
                    <input type="text" className="input" placeholder="Fuzzball" value={tempAttendee?.nickname || ''}
                        onChange={(e) => setTempAttendee({ ...tempAttendee, nickname: e.target.value })}
                        required />
                    <label className="label mt-2">Phone Number</label>
                    <input type="tel" className="input" placeholder="089 011 0123" value={tempAttendee?.phone || ''}
                        onChange={(e) => setTempAttendee({ ...tempAttendee, phone: e.target.value })}
                        onInput={handleInput}
                        onInvalid={handleInvalidPhoneField}
                        required />
                    <label className="label mt-2">Pronouns</label>
                    <input type="text" className="input mb-3" placeholder="Optional" value={tempAttendee?.pronouns || ''}
                        onChange={(e) => setTempAttendee({ ...tempAttendee, pronouns: e.target.value })}
                    />

                    <label className="label mt-2">Emergency Contact Name</label>
                    <input type="text" className="input mb-3" placeholder='Seán Gull' value={tempAttendee?.emergency_contact_name || ''}
                        onChange={(e) => setTempAttendee({ ...tempAttendee, emergency_contact_name: e.target.value })}
                    />

                    <label className='label mt-2'>Emergency Contact Number</label>
                    <input type='text' className='input mb-3' placeholder='085 987 65432' value={tempAttendee?.emergency_contact_phone || ''}
                        onChange={(e) => setTempAttendee({ ...tempAttendee, emergency_contact_phone: e.target.value })}
                    />

                    <label className="label mt-2 ">Accessibility Information and Medical Details</label>
                    <textarea className="input min-h-[90px] rounded-xl p-[10px] whitespace-normal" placeholder='Let us know about any extra requirements we might be able to help with'
                        value={tempAttendee?.medical_info || ''}
                        onChange={(e) => setTempAttendee({ ...tempAttendee, medical_info: e.target.value })}>
                    </textarea>

                    <ErrorMessage error={error} />
                    <button type="submit" className="btn btn-neutral mt-4 w-full">Update</button>
                    <button type="button" onClick={navigateBack} className="btn btn-neutral mt-4 w-full">Cancel</button>
                </form>
            )
            }
        </AuthWrapper >
    )
}