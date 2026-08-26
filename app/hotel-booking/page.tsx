"use client"

import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getHotelCode } from "../utils/public/supabase"
import { HotelBookingView } from "./view"
import { useAuth } from "../context/authContext"

export default function HotelBooking() {
    const router = useRouter()
    const {user} = useAuth();
    const [hotelCode, setHotelCode] = useState<string>()
    const [showError, setShowError] = useState(false)

    function navigateBack() {
        router.push('/dashboard')
    }

    useEffect(() => {
        if(user) {
            getHotelCode(user.id)
                .then((code) => setHotelCode(code))
                .catch(() => setShowError(true))
        }
    }, [user])

    return (
        <>
            <HotelBookingView onBack={navigateBack} discountCode={hotelCode} />
            <div role={showError ? "alert" : 'presentation'} className={`alert alert-error alert-vertical sm:alert-horizontal fixed bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-in-out text-[#fff] ${showError ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current h-6 w-6 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                    <h3 className="font-bold">Code Not Found</h3>
                    <div className="text-xs">Sorry, there was an error finding the discount code. Please try again soon.</div>
                </div>
                <button className="btn btn-sm btn-secondary bg-white text-error border-0 rounded-3xl" onClick={() => setShowError(false)}>Okay</button>
            </div>
        </>
    )
}
