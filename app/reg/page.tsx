"use client"

import { getTicketStock as getTicketStock, resumeCheckoutSession } from "../utils/public/stripe";
import { AuthWrapper } from "@/app/components/authWrapper";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSelectedProduct, handleCheckout } from "../utils/public/stripe";
import { useAuth } from "../context/authContext";
import Loading from "../components/loading";
import { days } from "../utils/day-mapping";

const regStartTime = Number(process.env.NEXT_PUBLIC_REG_START_TIME)
const regEndTime = Number(process.env.NEXT_PUBLIC_REG_END_TIME)

type AttendanceDay = 'Friday' | 'Saturday' | 'Sunday' | 'Full-Event'
type Tier = 'Standard' | 'Sponsor' | 'Super-Sponsor'

const soldOut = ' SOLD OUT'

const STEPS = {
    ATTENDANCE: 0,
    TIER: 1,
    PAYMENT: 2,
    CONFIRMATION: 3
}

export default function RegPageForm() {
    const [ticketData, setTicketData] = useState<Set<number>>(new Set())
    const [checkoutError, setCheckoutError] = useState(false)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const { user, attendee } = useAuth()
    const [currentStep, setCurrentStep] = useState(window.location.hash === '#confirmation' ? 3 : 0)
    useEffect(() => {
        const load = async () => {
            if (!user) { return }
            if (!(await resumeCheckoutSession(user.id))) {
                const ticketData = await getTicketStock()
                setTicketData(ticketData)
                setLoading(false)
            }
        }
        if (currentStep !== 3) {
            load()
        } else {
            setLoading(false)
        }

    }, [user])


    const [day, setDay] = useState<AttendanceDay | null>(null)
    const [tier, setTier] = useState<Tier | null>(null)
    const [loadingPayment, setLoadingPayment] = useState(false)

    const weekendDisabled = !([days.friday, days.saturday, days.sunday].every(d => ticketData.has(d)))

    function validateTicketStock(day: string): void {
        const soldOutError = new Error("Tickets are sold out for selected date(s)");

        switch (day) {
            case 'Friday':
                if (!ticketData.has(days.friday)) return
            case 'Saturday':
                if (!ticketData.has(days.saturday)) return
            case 'Sunday':
                if (!ticketData.has(days.sunday)) return
            case 'Weekend':
            default:
                if (!weekendDisabled) return
        }
        throw soldOutError;
    }

    function canBackStep() {
        return currentStep > 0 && currentStep < 3
    }

    function canForwardStep() {
        if (currentStep === 0) { return day !== null }
        if (currentStep === 1) { return tier !== null }
        return false
    }

    const overrideTimer = new URL(window.location.href).searchParams.has('noTimer')
    // Redirect to dashboard if attendee info not complete
    useEffect(() => {
        if (!attendee?.first_name || !attendee.last_name || !attendee.dob || (!overrideTimer && Date.now() < regStartTime) || Date.now() > regEndTime) {
            router.push('/dashboard')
        }
    }, [attendee])
    // Confetti effect for success step
    useEffect(() => {
        if (currentStep !== STEPS.CONFIRMATION) return
        var count = 400;
        var defaults = {
            origin: { y: 0.7 }
        };

        // TODO: Replace these with the leaf shapes from the leaf drawing branch when its ready.
        const oakLeaf = confetti.shapeFromPath({
            path: `M250 30
C190 90 165 180 170 285
C175 395 205 495 250 570
C295 495 325 395 330 285
C335 180 310 90 250 30
Z`
        });
        const leaf1 = confetti.shapeFromPath({
            path: `M250 30
C220 75 175 75 145 120
C175 145 115 205 55 220
C125 260 95 330 45 375
C120 390 155 465 130 520
C190 510 225 550 250 570
C275 550 310 510 370 520
C345 465 380 390 455 375
C405 330 375 260 445 220
C385 205 325 145 355 120
C325 75 280 75 250 30
Z`
        });
        const leaf2 = confetti.shapeFromPath({
            path: `M250 40
C205 95 185 170 170 255
C120 235 70 250 35 290
C80 315 120 340 170 360
C120 390 85 435 70 520
C145 495 205 455 250 415
C295 455 355 495 430 520
C415 435 380 390 330 360
C380 340 420 315 465 290
C430 250 380 235 330 255
C315 170 295 95 250 40
Z`
        });
        const leaf3 = confetti.shapeFromPath({
            path: `M250 30
C145 45 55 145 65 285
C75 425 155 520 250 570
C345 520 425 425 435 285
C445 145 355 45 250 30
Z`
        });

        function fire(particleRatio: number, opts: { spread: number, startVelocity?: number, decay?: number, scalar?: number, drift?: number, ticks?: number }) {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio),
                shapes: [oakLeaf, leaf1, leaf2, leaf3],
                colors: [
                    "#4F772D",
                    "#8A9A3B",
                    "#C97A2B",
                    "#A63D2F",
                    "#C9A227",
                ],
                scalar: 3
            });
        }

        fire(0.25, {
            spread: 26,
            startVelocity: 55,
            drift: 0.7,
            ticks: 100
        });
        fire(0.2, {
            spread: 60,
        });
        fire(0.35, {
            spread: 100,
            decay: 0.91,
            drift: 2.1,
            ticks: 200
        });
        fire(0.35, {
            spread: 100,
            decay: 0.91,
            drift: -2.1,
            ticks: 200
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            drift: -0.7,
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 45,
            drift: 0.4,
            ticks: 250
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
                        className={`step step-neutral ${currentStep >= index ? 'step-secondary' : ''
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
                        {loading ? <Loading /> :
                            (
                                <>
                                    {/* Step 1: Attendance */}
                                    <div className="min-w-full w-full flex-shrink-0 p-2">
                                        <div>
                                            <h2 className='font-[family-name:var(--font-sora)] text-xl mb-6'>Choose your Attendance Days</h2>
                                            <div className="space-y-4">
                                                <button
                                                    onClick={(e) => {
                                                        setDay('Full-Event' as AttendanceDay);
                                                        setCurrentStep(STEPS.TIER);
                                                    }}
                                                    className={`btn btn-neutral w-full ${day === 'Full-Event' && 'btn-secondary'}`}
                                                    disabled={weekendDisabled}
                                                >
                                                    <span>Full-Event, 2<sup>nd</sup> - 4<sup>th</sup> April 2027</span>
                                                    {(weekendDisabled) && soldOut}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setDay('Friday' as AttendanceDay);
                                                        setCurrentStep(STEPS.TIER);
                                                    }}
                                                    className={`btn btn-neutral w-full ${day === 'Friday' && 'btn-secondary'}`}
                                                    disabled={!ticketData.has(days.friday)}
                                                >
                                                    <span>Friday, 4<sup>th</sup> April 2027</span>
                                                    {!ticketData.has(days.friday) && soldOut}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setDay('Saturday' as AttendanceDay);
                                                        setCurrentStep(STEPS.TIER);
                                                    }}
                                                    className={`btn btn-neutral w-full ${day === 'Saturday' && 'btn-secondary'}`}
                                                    disabled={!ticketData.has(days.saturday)}
                                                >
                                                    <span>Saturday, 5<sup>th</sup> April 2027</span>
                                                    {!ticketData.has(days.saturday) && soldOut}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setDay('Sunday' as AttendanceDay);
                                                        setCurrentStep(STEPS.TIER);
                                                    }}
                                                    className={`btn btn-neutral w-full ${day === 'Sunday' && 'btn-secondary'}`}
                                                    disabled={!ticketData.has(days.sunday)}
                                                >
                                                    <span>Sunday, 6<sup>th</sup> April 2027</span>
                                                    {!ticketData.has(days.sunday) && soldOut}
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
                                                    className={`btn btn-neutral w-full ${tier === 'Standard' && 'btn-secondary'}`}
                                                >
                                                    Standard
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setTier('Sponsor' as Tier);
                                                        setCurrentStep(STEPS.PAYMENT);
                                                    }}
                                                    className={`btn btn-neutral w-full ${tier === 'Sponsor' && 'btn-secondary'}`}
                                                >
                                                    Sponsor
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setTier('Super-Sponsor' as Tier);
                                                        setCurrentStep(STEPS.PAYMENT);
                                                    }}
                                                    className={`btn btn-neutral w-full ${tier === 'Super-Sponsor' && 'btn-secondary'}`}
                                                    disabled={day !== 'Full-Event'}
                                                >
                                                    Super-Sponsor {day !== 'Full-Event' && '(Available with Full-Event tickets)'}
                                                </button>
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
                                                            await handleCheckout(user.id, productData.default_price, day);
                                                        }
                                                    } catch (e) {
                                                        console.error(e);
                                                        setLoadingPayment(false);
                                                        setCheckoutError(true)

                                                    }
                                                }}
                                                className="btn btn-neutral w-full max-w-94"
                                                disabled={loadingPayment}
                                            >
                                                {loadingPayment ? (<span className="loading loading-ring loading-sm mr-2"></span>) : (<span>Pay now</span>)}
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
                                                className='btn btn-secondary rounded-md'
                                                onClick={() => router.push('/dashboard')}
                                            >
                                                Return to dashboard
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                    </div>
                </div>
                {<button className={`btn btn-circle w-[2rem] h-[2rem] btn-neutral mt-[53px] opacity-${canForwardStep() ? '100' : '0'} transition-all duration-200`} onClick={() => { if (canForwardStep()) { setCurrentStep(currentStep + 1) } }}>&gt;</button>}
            </div>
            <div role={checkoutError ? "alert" : 'presentation'} className={`alert alert-error alert-vertical sm:alert-horizontal fixed bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-in-out text-[#fff] ${checkoutError ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current h-6 w-6 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                    <h3 className="font-bold">Checkout Error</h3>
                    <div className="text-xs">Sorry, there was an error checking out. Please try again later.</div>
                </div>
                <button className="btn btn-sm btn-secondary bg-white text-error border-0 rounded-3xl" onClick={() => setCheckoutError(false)}>Okay</button>
            </div>

        </AuthWrapper>
    )
}