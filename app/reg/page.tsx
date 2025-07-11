"use client"

import { AuthWrapper } from '../components/authWrapper'

import { useAuth } from '../context/authContext';
import Loading from '../components/loading';
import Link from 'next/link';

export default function UserDetailsPage() {
    const { user } = useAuth()

    const SATURDAY = "SATURDAY"
    const SUNDAY = "SUNDAY"
    const WEEKEND = "WEEKEND"
    const STEP_TWO = "/reg/ticket-tier"

    if (!user) { return <Loading /> }

    let currentStep = 0

    function getStepStatus(stepElement: number): string {
        return currentStep >= stepElement
            ? "step step-primary"
            : "step"
    }

    return (
        <AuthWrapper>
            <ul className="steps">
                <li className={getStepStatus(0)}>Attendance</li>
                <li className={getStepStatus(1)}>Ticket Tier</li>
                <li className={getStepStatus(2)}>Personal Info</li>
                <li className={getStepStatus(3)}>Payment</li>
                <li className={getStepStatus(4)}>Confirmation</li>
            </ul>

            <div className="carousel w-full">
                <div id="step1" className="carousel-item relative w-full">
                    <span className='font-[family-name:var(--font-sora)] text-xl'>
                        Choose your Attendance Days
                    </span>

                    <Link href={{
                        pathname: STEP_TWO,
                        query: SATURDAY
                    }} className='btn'>
                        Day Pass: Saturday
                    </Link>

                    <Link href={{
                        pathname: STEP_TWO,
                        query: SUNDAY
                    }} className='btn'>
                        Day Pass: Sunday
                    </Link>

                    <Link href={{
                        pathname: STEP_TWO,
                        query: WEEKEND
                    }} className='btn'>
                        Full Weekend
                    </Link>
                </div>

                <div id="step2" className="carousel-item relative w-full">
                    <span>Step 2</span>
                </div>
            </div>

            {/* <button className='btn' onClick={() => handleCheckout(user.id, 'price_1RiKMxQslLjui9q05yaSXxx5')}>Full Weekend</button> */}

        </AuthWrapper >
    )
}