"use client"

import { useAuth } from '@/app/context/authContext';
import Loading from '@/app/components/loading';
import { AuthWrapper } from '@/app/components/authWrapper';
import Link from 'next/link';

const saturday = "saturday"
const sunday = "sunday"
const weekend = "weekend"

const selectTierPage = "/reg/select-tier"

export default function RegSelectDayPage() {
    const { user } = useAuth()

    if (!user) { return <Loading /> }

    return (
        <AuthWrapper>
            <ul className="steps w-full">
                <li className="step step-primary">Attendance</li>
                <li className="step">Ticket Tier</li>
                <li className="step">Personal Info</li>
                <li className="step">Payment</li>
                <li className="step">Confirmation</li>
            </ul>

            <h2 className='font-[family-name:var(--font-sora)] text-xl'>
                Choose your Attendance Days
            </h2>

            <Link type='button' className='btn' id={saturday}
                href={{
                    pathname: selectTierPage,
                    query: { day: saturday }
                }}>
                Day Pass: Saturday
            </Link>

            <Link type='button' className='btn' id={sunday}
                href={{
                    pathname: selectTierPage,
                    query: { day: sunday }
                }}>
                Day Pass: Sunday
            </Link>

            <Link type='button' className='btn' id={weekend}
                href={{
                    pathname: selectTierPage,
                    query: { day: weekend }
                }}>
                Full Weekend
            </Link>
        </AuthWrapper >
    )
}