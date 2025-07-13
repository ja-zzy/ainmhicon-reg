"use client"

import { AuthWrapper } from '../components/authWrapper'

import { useRouter } from 'next/navigation'
import confetti from "canvas-confetti";
import { useEffect } from 'react';

export default function UserDetailsPage() {
    const router = useRouter()
    useEffect(() => {
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
    }, [])
    return (
        <AuthWrapper>
            <h2 className='font-[family-name:var(--font-sora)] text-xl'>
                You're going to Ainmhícon!
            </h2>
            <p className='my-[8px]'>Thank you, we've received your payment! We'll be in touch with more details soon. In the meantime, you can update your details whenever you like from the dashboard</p>
            <button className='btn' onClick={() => router.push('/dashboard')}>Return to dashboard</button>
        </AuthWrapper >
    )
}