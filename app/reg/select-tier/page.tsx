"use client"

import { AuthWrapper } from "@/app/components/authWrapper";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const standard = "standard"
const sponsor = "sponsor"
const founder = "founder"
const weekend = "weekend"

const personalInfoPage = "/reg/personal-info"

export default function RegSelectTierPage() {
    const searchParams = useSearchParams()

    const selectedDay = searchParams.get("day") ?? weekend

    function displayFounderOption(): boolean {
        return (selectedDay?.localeCompare(weekend) === 0)
    }

    return (
        <AuthWrapper>
            <ul className="steps w-full">
                <li className="step step-primary">Attendance</li>
                <li className="step step-primary">Ticket Tier</li>
                <li className="step">Personal Info</li>
                <li className="step">Payment</li>
                <li className="step">Confirmation</li>
            </ul>

            <h2 className='font-[family-name:var(--font-sora)] text-xl'>
                Choose your Ticket Tier
            </h2>

            <p>You will be attending: {selectedDay?.toUpperCase()}</p>

            <Link type='button' className='btn' id={standard}
                href={{
                    pathname: personalInfoPage,
                    query: { day: selectedDay, tier: standard }
                }}>
                Standard Ticket
            </Link>

            <Link type='button' className='btn' id={sponsor}
                href={{
                    pathname: personalInfoPage,
                    query: { day: selectedDay, tier: sponsor }
                }}>
                Sponsor Ticket
            </Link>


            {displayFounderOption() &&
                <Link type='button' className='btn' id={founder}
                    href={{
                        pathname: personalInfoPage,
                        query: { day: selectedDay, tier: founder }
                    }}>
                    Founder Ticket
                </Link>
            }

        </AuthWrapper>
    )
}