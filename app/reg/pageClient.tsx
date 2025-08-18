"use client"

import { AuthWrapper } from "@/app/components/authWrapper";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSelectedProduct, handleCheckout } from "../utils/public/stripe";
import { useAuth } from "../context/authContext";

const regStartTime = Number(process.env.NEXT_PUBLIC_REG_START_TIME)

type AttendanceDay = 'Saturday' | 'Sunday' | 'Weekend'
type Tier = 'Standard' | 'Sponsor' | 'Founder'

const STEPS = {
    ATTENDANCE: 0,
    TIER: 1,
    PAYMENT: 2,
    CONFIRMATION: 3
}

type TicketProps = {
    saturdayDisabled: boolean,
    sundayDisabled: boolean
}

export default function RegPage({ saturdayDisabled, sundayDisabled }: TicketProps) {
    const router = useRouter()
    const { user, attendee } = useAuth()

    const [currentStep, setCurrentStep] = useState(window.location.hash === '#confirmation' ? 3 : 0)
    const [day, setDay] = useState<AttendanceDay | null>(null)
    const [tier, setTier] = useState<Tier | null>(null)
    const [loadingPayment, setLoadingPayment] = useState(false)

    function validateTicketStock(day: string): void {
        const soldOutError = new Error("Tickets are sold out for selected date(s)");

        switch (day) {
            case 'Saturday':
                if (!saturdayDisabled) return
            case 'Sunday':
                if (!sundayDisabled) return
            case 'Weekend':
            default:
                if (!weekendDisabled()) return
        }
        throw soldOutError;
    }

    function weekendDisabled(): boolean {
        return saturdayDisabled || sundayDisabled;
    }

    function canBackStep() {
        return currentStep > 0 && currentStep < 3
    }

    function canForwardStep() {
        if (currentStep === 0) { return day !== null }
        if (currentStep === 1) { return tier !== null }
        return false
    }

    // Redirect to dashboard if attendee info not complete
    useEffect(() => {
        if (!attendee?.first_name || !attendee.last_name || !attendee.dob || Date.now() < regStartTime) {
            router.push('/dashboard')
        }
    }, [attendee])
    // Confetti effect for success step
    useEffect(() => {
        if (currentStep !== STEPS.CONFIRMATION) return

        var count = 200;
        var defaults = {
            origin: { y: 0.7 }
        };

        function fire(particleRatio: number, opts: { spread: number, startVelocity?: number, decay?: number, scalar?: number }) {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio)
            });
        }

        fire(0.25, {
            spread: 26,
            startVelocity: 55,
        });
        fire(0.2, {
            spread: 60,
        });
        fire(0.35, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 45,
        });
    }, [currentStep])

    const goToAttendance = () => {
        if (currentStep > STEPS.ATTENDANCE && currentStep !== STEPS.CONFIRMATION) {
            setCurrentStep(STEPS.ATTENDANCE)
            setTier(null)
        }
    }

    const goToTier = () => {
        if (currentStep > STEPS.TIER && currentStep !== STEPS.CONFIRMATION && day) {
            setCurrentStep(STEPS.TIER)
        }
    }

    const stepTitles = ['Attendance', 'Ticket Tier', 'Payment', 'Confirmation']

    return (
        <AuthWrapper>
            {/* Progress Bar */}
            <ul className="steps w-full mb-8">
                {stepTitles.map((title, index) => (
                    <li
                        key={index}
                        onClick={() => {
                            if (index === 0) goToAttendance()
                            if (index === 1) goToTier()
                        }}
                        className={`step ${currentStep >= index ? 'step-primary' : ''
                            } ${((index === 0 && (currentStep === 1 || currentStep === 2)) ||
                                (index === 1 && currentStep === 2)) ? 'cursor-pointer' : ''
                            }`}
                    >
                        {title}
                    </li>
                ))}
            </ul>

            {/* Sliding Form Container */}
            <div className="flex flex-row items-center justify-around">
                {<button className={`btn btn-circle w-[2rem] h-[2rem] btn-neutral mt-[53px] opacity-${canBackStep() ? '100' : '0'} transition-all duration-200`} onClick={() => { if (canBackStep()) { setCurrentStep(currentStep - 1) } }}>&lt;</button>}
                <div className="relative w-[75%] overflow-hidden mb-auto max-w-[80vw] ">
                    <div
                        className="flex w-full h-full transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentStep * 100}%)` }}
                    >
                        {/* Step 1: Attendance */}
                        <div className="min-w-full w-full flex-shrink-0 p-2">
                            <div>
                                <h2 className='font-[family-name:var(--font-sora)] text-xl mb-6'>Choose your Attendance Days</h2>
                                <div className="space-y-4">
                                    <button
                                        onClick={(e) => {
                                            setDay('Weekend' as AttendanceDay);
                                            setCurrentStep(STEPS.TIER);
                                        }}
                                        className={`btn btn-neutral w-full ${day === 'Weekend' && 'btn-primary'}`}
                                        disabled={weekendDisabled()}
                                    >
                                        Full Weekend, 11th-12th April 2026
                                        {(weekendDisabled()) && " SOLD OUT"}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            setDay('Saturday' as AttendanceDay);
                                            setCurrentStep(STEPS.TIER);
                                        }}
                                        className={`btn btn-neutral w-full ${day === 'Saturday' && 'btn-primary'}`}
                                        disabled={saturdayDisabled}
                                    >
                                        Saturday, 11th April 2026
                                        {saturdayDisabled && " SOLD OUT"}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            setDay('Sunday' as AttendanceDay);
                                            setCurrentStep(STEPS.TIER);
                                        }}
                                        className={`btn btn-neutral w-full ${day === 'Sunday' && 'btn-primary'}`}
                                        disabled={sundayDisabled}
                                    >
                                        Sunday, 12th April 2026
                                        {sundayDisabled && " SOLD OUT"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Tier */}
                        <div className="min-w-full w-full flex-shrink-0 p-2">
                            <div>
                                <h2 className='font-[family-name:var(--font-sora)] text-xl mb-6'>Choose your Tier</h2>
                                <div className="space-y-4">
                                    <button
                                        onClick={() => {
                                            setTier('Standard' as Tier);
                                            setCurrentStep(STEPS.PAYMENT);
                                        }}
                                        className={`btn btn-neutral w-full ${tier === 'Standard' && 'btn-primary'}`}
                                    >
                                        Standard
                                    </button>
                                    <button
                                        onClick={() => {
                                            setTier('Sponsor' as Tier);
                                            setCurrentStep(STEPS.PAYMENT);
                                        }}
                                        className={`btn btn-neutral w-full ${tier === 'Sponsor' && 'btn-primary'}`}
                                    >
                                        Sponsor
                                    </button>
                                    {day === 'Weekend' && (
                                        <button
                                            onClick={() => {
                                                setTier('Founder' as Tier);
                                                setCurrentStep(STEPS.PAYMENT);
                                            }}
                                            className={`btn btn-neutral w-full ${tier === 'Founder' && 'btn-primary'}`}
                                        >
                                            Founder
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Step 3: Payment */}
                        <div className="min-w-full  w-full flex-shrink-0 p-2">
                            <div>
                                <h2 className='font-[family-name:var(--font-sora)] text-xl mb-6'>Pay for your ticket</h2>
                                <p className="mb-6">To secure your <b>{day} {tier}</b> ticket please click below to pay securely via Stripe</p>
                                <button
                                    onClick={async () => {
                                        if (!day || !tier) return;

                                        setLoadingPayment(true);

                                        try {
                                            const res = await getSelectedProduct(day, tier);
                                            const productData = await res.json();

                                            validateTicketStock(day)

                                            if (user) {
                                                await handleCheckout(user.id, productData.default_price);
                                            }
                                        } catch (e) {
                                            console.error(e);
                                            setLoadingPayment(false);
                                        }
                                    }}
                                    className="btn btn-neutral w-full"
                                    disabled={loadingPayment}
                                >
                                    {loadingPayment && <span className="loading loading-ring loading-md mr-2"></span>}
                                    {loadingPayment ? 'Processing...' : 'Pay now'}
                                </button>
                            </div>
                        </div>

                        {/* Step 4: Confirmation */}
                        <div className="min-w-full w-full flex-shrink-0 p-2">
                            <div className="text-center">
                                <h2 className='font-[family-name:var(--font-sora)] text-xl mb-4'>
                                    You're going to Ainmhícon!
                                </h2>
                                <p className='mb-6'>
                                    Thank you, we've received your payment! We'll be in touch with more details soon.
                                    In the meantime, you can update your details whenever you like from the dashboard
                                </p>
                                <button
                                    className='btn btn-primary'
                                    onClick={() => router.push('/dashboard')}
                                >
                                    Return to dashboard
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {<button className={`btn btn-circle w-[2rem] h-[2rem] btn-neutral mt-[53px] opacity-${canForwardStep() ? '100' : '0'} transition-all duration-200`} onClick={() => { if (canForwardStep()) { setCurrentStep(currentStep + 1) } }}>&gt;</button>}
            </div>
        </AuthWrapper>
    )
}