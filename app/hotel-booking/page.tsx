"use client"

import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getHotelCode } from "../utils/public/supabase"

export default function HotelBooking() {
    const router = useRouter()
    const [hotelCode, setHotelCode] = useState<string>()
    const [error, setError] = useState(false)

    function navigateBack() {
        router.push('/dashboard')
    }

    useEffect(() => {
        getHotelCode()
            .then(setHotelCode)
            .catch(() => setError(true))
    }, [])

    return (
        <>
            <p>To book a room in our venue hotel, please book directly on their website:</p>
            <p>For more information about staying at the venue please <a href='https://ainmhicon.ie/pricing' target='_blank' className="link">Click Here</a></p>
            <Link href='https://www.claytonhotels.com/liffey-valley/' target='_blank' className='btn mt-2 btn-secondary rounded-md'>Clayton Hotel Liffey Valley Website</Link>
            <p>Use the promo code "<b>{error ? 'unavailable' : hotelCode ?? 'loading...'}</b>" when completing your booking! This will give a small discount on flexible room rates.</p>

            <button type="button" onClick={navigateBack} className="btn btn-neutral mt-18 w-full rounded-md">Back to Dashboard</button>
        </>
    )
}
