"use client"

import { AuthWrapper } from "@/app/components/authWrapper"
import Loading from "@/app/components/loading"
import { useAuth } from "@/app/context/authContext"
import { getSelectedProduct, handleCheckout } from "@/app/utils/public/stripe"
import { useSearchParams } from "next/navigation"
import { useState } from "react"

const weekend = "weekend"
const standard = "standard"

export default function RegPersonalInfoPage() {
    const { user } = useAuth()
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(false)

    if (!user) { return <Loading /> }

    const selectedDay = searchParams.get("day") ?? weekend
    const selectedTier = searchParams.get("tier") ?? standard

    async function goToCheckout() {
        setLoading(true)
        const res = await getSelectedProduct(selectedDay, selectedTier)
        const productData = await res.json()
        setLoading(false)

        try{
            if (user) handleCheckout(user.id, productData.default_price)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <AuthWrapper>
            {loading && <Loading />}

            <ul className="steps w-full">
                <li className="step step-primary">Attendance</li>
                <li className="step step-primary">Ticket Tier</li>
                <li className="step step-primary">Personal Info</li>
                <li className="step">Payment</li>
                <li className="step">Confirmation</li>
            </ul>

            <h2 className='font-[family-name:var(--font-sora)] text-xl'>
                Personal Info
            </h2>

            <p>You will be attending: {selectedDay?.toUpperCase()}</p>
            <p>Ticket tier: {selectedTier?.toUpperCase()}</p>

            <form onSubmit={goToCheckout}>
                <label className="label">Nickname/Furry Name</label>
                <input type='text' className="input" placeholder="Fuzzball" required></input>

                <label className="label">Legal Name</label>
                <input type="text" className="input" placeholder="Jane Doe" required></input>

                <label className="label">Date of Birth</label>
                <input type="date" className="input" required></input>

                <label className="label">Accessibility Information/Medical Details</label>
                <textarea className="input"></textarea>

                <button type="submit" className="btn btn-neutral mt-4 w-full">Submit</button>
            </form>
        </AuthWrapper>
    )
}