"use client"
import { FormEventHandler, useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import ErrorMessage from '../components/errorMessage'

const checkEmailId = "login-carousel-check"
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

        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 pt-18 shadow-lg">
            <div className="carousel w-full">
                <div className="carousel-item relative w-full">
                    <form onSubmit={handleLogin} className='p-2'>
                        <p className='m-3 ms-0 me-0'>To register or login, first enter your email address</p>
                        <label className="label">Email</label>
                        <input type="email" className="input" placeholder="ceol@ainmhicon.com" value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required disabled={loading} />
                        <ErrorMessage error={error} />
                        <button type="submit" className="btn btn-neutral mt-4 w-full" disabled={loading}>{loading && <span className="loading loading-ring loading-md"></span>}{!loading && <>Send Magic Link</>}</button>
                    </form>
                </div>
                <div id={checkEmailId} className="carousel-item relative w-full">
                    <p>Thanks, we've sent you an email. Please check your inbox</p>
                </div>
            </div>
        </fieldset>
    )
}