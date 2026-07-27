"use client"
import { FormEventHandler, useState } from 'react'
import { supabase } from '../utils/public/supabase'
import ErrorMessage from '../components/errorMessage'
import { Google } from '../third-party-auth/google'
import { Discord } from '../third-party-auth/discord'

const checkEmailId = "login-carousel-check"
const startId = "start"
export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>()


    const handleLogin: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        if (loading) { return }
        setLoading(true)
        setError(null)
        const { error } = await supabase.auth.signInWithOtp({ email })
        setLoading(false)
        if (error) {
            setError(error.message)
        } else {
            location.hash = `#${checkEmailId}`
        }
    }

    return (
        <div className="carousel w-full mb-auto">
            <div id={startId} className="carousel-item relative w-full flex flex-col items-center">
                <form onSubmit={handleLogin} className='p-2'>
                    <h2 className='font-[family-name:var(--font-sora)] text-xl'>Ainmhícon Registration</h2>
                    <label className="label mt-4 mb-2">Sign in with Email</label>
                    <input type="email" className="input rounded-md border py-3 px-2 bg-transparent" placeholder="ceol@ainmhicon.ie" value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required disabled={loading} />
                    <ErrorMessage error={error} />
                    <button type="submit" className="btn btn-neutral mt-2 rounded-md bg-base-100 py-3 w-full font-bold border-none text-base-content" disabled={loading}>{loading && <span className="loading loading-ring loading-md"></span>}{!loading && <>Send Magic Link</>}</button>

                </form>
                        <div className="divider">Or</div>
                        <div className='flex flex-col gap-2'>
                            {false && <Google />}
                            <Discord />
                        </div>

            </div>
            <div id={checkEmailId} className="carousel-item relative w-full flex flex-col justify-between" style={{ wordBreak: 'break-word' }}>
                <p>Thanks, we've sent an email to <b>{email}</b>. If you don't receive it within the next few minutes, please check your spam box and ensure the email entered was correct!</p>
                <button onClick={() => {
                    location.hash = startId
                    setEmail('')
                }} className="btn btn-neutral mt-2 rounded-md bg-base-100 text-base-content py-3 w-full font-bold border-none " disabled={loading}>Start Over</button>
            </div>
        </div>
    )
}