"use client"
import Link from 'next/link'
import { AuthWrapper } from '../components/authWrapper'
import { useAuth } from '../context/authContext'
import { useEffect, useState } from 'react'
import moment from 'moment'

const regStart = 1754006400000
export default function Dashboard() {
    const { attendee, logout } = useAuth()
    const [time, setTime] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now()), 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);
    if (!attendee) { return null }

    const duration = moment.duration(regStart - time);
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    return (
        <>
            <h2 className='font-[family-name:var(--font-sora)] text-xl'>
                Welcome back, {attendee.first_name}!
            </h2>
            <p className='my-[8px]'>Thanks for signing up, this is your user dashboard. From here you can register for our upcoming conventions</p>
            <h3>Your Tasks</h3>
            <Link href='/user-details' className='btn'>Update my details </Link>
            <Link href='/reg-2026' className='btn btn-dash cursor-not-allowed pointer-events-none' >Register for Ainmhícon 2026 </Link>

            <h3 className='mt-[8px]'>Reg Opens In</h3>
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
            <button onClick={() => logout()} className="btn btn-neutral mt-4 w-full mt-auto">Logout</button>
        </>
    )
}