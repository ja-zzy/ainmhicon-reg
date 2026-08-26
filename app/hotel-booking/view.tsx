"use client"

import Link from "next/link"
import { useEffect, useState } from 'react'
import Loading from "../components/loading"

interface Props {
    discountCode?: string
    onBack?: () => void
}

export function HotelBookingView({ discountCode, onBack }: Props) {
    return (
        <>
            <p>To book a room in our venue hotel, please book directly on their website by clicking the button below. For more information about staying at the venue please <a href='https://ainmhicon.ie/pricing' target='_blank' className="link">click here</a></p>
            <p className='mt-2'>You can use the promo code</p>
            <CopyTextChip text={discountCode} />
            <p>when completing your booking to get a special room rate.</p>
            <Link href='https://www.claytonhotels.com/liffey-valley/' target='_blank' className='btn mt-8 btn-secondary rounded-md'>Clayton Hotel Liffey Valley Website</Link>

            <button type="button" onClick={onBack} className="btn btn-neutral w-full rounded-md">Back to Dashboard</button>
        </>
    )
}

interface CopyTextChipProps {
    text?: string
}

function CopyTextChip({ text }: CopyTextChipProps) {
    const [status, setStatus] = useState<'idle' | 'copied'>('idle');
    const onClick = async () => {
        if (!text) return

        try {
            await navigator.clipboard.writeText(text)

            setStatus('copied')
            setTimeout(() => {
                setStatus('idle');
            }, 2000)
        } catch {
            setStatus('idle');
        }
    };

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={!text}
            className={`min-w-25 h-10 m-auto my-2 rounded-full bg-base-100 px-3 scale-100 transition-all duration-225 hover:cursor-pointer hover:scale-120 disabled:cursor-wait disabled:hover:scale-100 ${status === 'copied' && 'bg-info'}`}
        >
            {!text ? <Loading /> :  (
                <span>
                    {status === "copied" && "Copied!"}
                    {status === "idle" && text}
                </span>
            )}
        </button>
    );
}