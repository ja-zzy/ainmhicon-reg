"use client"
import Link from 'next/link'
import { useAuth } from '../context/authContext'
import { useEffect, useState } from 'react'
import moment from 'moment'
import Bluesky from './social-logos/bluesky'
import Instagram from './social-logos/instagram'
import Telegram from './social-logos/telegram'

const regStartTime = Number(process.env.NEXT_PUBLIC_REG_START_TIME)
const regEndTime = Number(process.env.NEXT_PUBLIC_REG_END_TIME)

export default function Dashboard() {
    const { attendee, registration, logout } = useAuth()
    const [time, setTime] = useState(Date.now());
    const [showCancelled, setShowCancelled] = useState(false);
    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now()), 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);


    useEffect(() => {
        if (window.location.hash === "#payment-cancelled") {
            setShowCancelled(true);
            // Remove hash to avoid repeat message
            history.replaceState(null, "", window.location.pathname);
        }
    }, []);

    function getAttendingDate(ticketType: string) {
        switch (ticketType) {
            case "Ainmhícon 2026 - Weekend Standard Ticket":
            case "Ainmhícon 2026 - Weekend Sponsor Ticket":
            case "Ainmhícon 2026 - Founder Package":
                return "(11/04/2026) - (12/04/2026)";
            case "Ainmhícon 2026 - Day Pass Saturday Standard Ticket":
            case "Ainmhícon 2026 - Day Pass Saturday Sponsor Ticket":
                return "(11/04/2026)"
            case "Ainmhícon 2026 - Day Pass Sunday Standard Ticket":
            case "Ainmhícon 2026 - Day Pass Sunday Sponsor Ticket":
                return "(12/04/2026)";
            default:
                return "";
        }
    }

    if (!attendee) { return null }

    const timeUntilRegStart = moment.duration(regStartTime - time);
    const overrideTimer = new URL(window.location.href).searchParams.has('noTimer')
    const timeUntilRegEnd = moment.duration(regEndTime - time)

    const sufficientDetailToPurchaseTicket = attendee.first_name && attendee.last_name && attendee.dob

    const timeToCountDown = (targetTime: moment.Duration) => {
        const days = Math.floor(targetTime.asDays());
        const hours = targetTime.hours();
        const minutes = targetTime.minutes();
        const seconds = targetTime.seconds();
        return (
            <div className="grid grid-flow-col gap-5 text-center auto-cols-max m-auto my-[16px]">
                <div className="flex flex-col items-center p-2 bg-neutral rounded-box text-neutral-content">
                    <span className="countdown font-mono text-2xl">
                        <span style={{ "--value": days } as React.CSSProperties} aria-live="polite" aria-label={days.toString()}>{days}</span>
                    </span>
                    days
                </div>
                <div className="flex flex-col items-center p-2 bg-neutral rounded-box text-neutral-content">
                    <span className="countdown font-mono text-2xl">
                        <span style={{ "--value": hours } as React.CSSProperties} aria-live="polite" aria-label={hours.toString()}>{hours}</span>
                    </span>
                    hours
                </div>
                <div className="flex flex-col items-center p-2 bg-neutral rounded-box text-neutral-content">
                    <span className="countdown font-mono text-2xl">
                        <span style={{ "--value": minutes } as React.CSSProperties} aria-live="polite" aria-label={minutes.toString()}>{minutes}</span>
                    </span>
                    min
                </div>
                <div className="flex flex-col items-center p-2 bg-neutral rounded-box text-neutral-content">
                    <span className="countdown font-mono text-2xl">
                        <span style={{ "--value": seconds } as React.CSSProperties} aria-live="polite" aria-label={seconds.toString()}>{seconds}</span>
                    </span>
                    sec
                </div>
            </div>
        )
    }
    const regTimerStartComponent = (
        <>
            <h3 className='mt-[16px] text-base text-center'>Reg Opens In</h3>
            {timeToCountDown(timeUntilRegStart)}
        </>
    )

    const regTimerEndComponent = (
        <>
            <h3 className='mt-[16px] text-base text-center'>Reg Closes In</h3>
            {timeToCountDown(timeUntilRegEnd)}
        </>
    )
    const startRegComponent = (<>
        {!sufficientDetailToPurchaseTicket && <p className='my-[8px]'>Before you register for a ticket you'll need to provide some additional information, please update your details.</p>}
        {(regEndTime - time <= (1000 * 60 * 60 * 24 * 9 /* 1 week */)) && regTimerEndComponent}
        <Link href='/reg' className={`btn ${!sufficientDetailToPurchaseTicket && 'btn-disabled'}`}>Register for Ainmhícon 2026</Link>
    </>)
    const regClosedComponent = (
        <>
            <h3 className='mt-[24px] text-lg'>Registration for Ainmhícon 2026 is now closed</h3>
            <p>Sorry if you didn't get to join us this year. Keep an eye on our socials for announcements about  Ainmhícon 2027!</p>
            <div className='flex justify-evenly mt-[16px]'>
                <a href='https://bsky.app/profile/ainmhicon.ie'>
                    <Bluesky />
                </a>
                <a href='https://www.instagram.com/ainmhicon'>
                    <Instagram />
                </a>
                <a href='https://t.me/ainmhicon'>
                    <Telegram />
                </a>
            </div>
        </>
    )

    let regFlowStart;
    if (!registration) {
        if (time > regEndTime) {
            regFlowStart = regClosedComponent
        } else if (overrideTimer || time >= regStartTime) {
            regFlowStart = startRegComponent
        } else {
            regFlowStart = regTimerStartComponent
        }
    }

    return (
        <>
            <div role={showCancelled ? "alert" : 'presentation'} className={`alert alert-error alert-vertical sm:alert-horizontal fixed bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-in-out ${showCancelled ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-base-300 h-6 w-6 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                    <h3 className="font-bold">Payment cancelled</h3>
                    <div className="text-xs">Sorry, your payment did not complete. You have not been charged. Please try again later.</div>
                </div>
                <button className="btn btn-sm btn-secondary" onClick={() => setShowCancelled(false)}>Okay</button>
            </div>
            <h2 className='font-[family-name:var(--font-sora)] text-xl'>
                Welcome back, {attendee.nickname}!
            </h2>
            {!registration && <p className='my-[8px]'>Thanks for signing up, this is your user dashboard. From here you can register for our upcoming conventions</p>}
            {registration && <>
                <p className='my-[8px]'>You are registered for Ainmhícon 2026!</p>
                <p className='text-center font-bold'>{registration.ticket_type} <br /> {getAttendingDate(registration.ticket_type)}</p>
                <p className='my-[8px]'>Your badge number is <b>#{registration.badge_id}</b>, we're looking forward to seeing you soon!</p>
            </>}
            {registration && <p className='my=[8px]'><em>If you wish to cancel or upgrade your ticket please email:</em> <a href='reg@ainmhicon.ie' className='underline text-info'>reg@ainmhicon.ie</a></p>}

            <Link href='/user-details' className='btn mt-8'>Update my details</Link>
            {registration && <Link href='/hotel-booking' className='btn'>Booking the Venue Hotel</Link>}

            {regFlowStart}
            <button onClick={() => logout()} className="btn btn-neutral mt-8 w-full ">Logout</button>
        </>)
}