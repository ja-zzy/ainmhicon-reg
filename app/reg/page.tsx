"use client"

import { AuthWrapper } from "@/app/components/authWrapper";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSelectedProduct, handleCheckout } from "../utils/public/stripe";
import { useAuth } from "../context/authContext";

type AttendanceDay = 'Saturday' | 'Sunday' | 'Weekend'
type Tier = 'Standard' | 'Sponsor' | 'Founder'

const STEPS = {
    ATTENDANCE: 0,
    TIER: 1,
    PAYMENT: 2,
    CONFIRMATION: 3
}

export default function RegPage() {
    const router = useRouter()
    const { user, attendee } = useAuth()

    const [currentStep, setCurrentStep] = useState(window.location.hash === '#confirmation' ? 3 : 0)
    const [day, setDay] = useState<AttendanceDay | null>(null)
    const [tier, setTier] = useState<Tier | null>(null)
    const [loadingPayment, setLoadingPayment] = useState(false)

    // Redirect to dashboard if attendee info not complete
    useEffect(() => {
        if (!attendee?.first_name || !attendee.last_name || !attendee.dob) {
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
            <div className="relative w-full overflow-hidden mb-auto max-w-[80vw]">
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
                                >
                                    Full Weekend, 11th-12th April 2026
                                </button>
                                <button
                                    onClick={(e) => {
                                        setDay('Saturday' as AttendanceDay);
                                        setCurrentStep(STEPS.TIER);
                                    }}
                                    className={`btn btn-neutral w-full ${day === 'Saturday' && 'btn-primary'}`}
                                >
                                    Saturday, 11th April 2026
                                </button>
                                <button
                                    onClick={(e) => {
                                        setDay('Sunday' as AttendanceDay);
                                        setCurrentStep(STEPS.TIER);
                                    }}
                                    className={`btn btn-neutral w-full ${day === 'Sunday' && 'btn-primary'}`}
                                >
                                    Sunday, 12th April 2026
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
        </AuthWrapper>
    )
}