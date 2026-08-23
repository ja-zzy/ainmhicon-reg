import { stripe } from '@/app/utils/private/stripe';
import { getActiveCheckoutSession } from '@/app/utils/private/supabase';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { userId } = await req.json()
    const activeCheckoutSession = await getActiveCheckoutSession(userId)
    if(!activeCheckoutSession) { 
        console.warn('No checkout session found to cancel for user', userId)
        return new NextResponse("No active checkout session", { status: 400 })
    }
    await stripe.checkout.sessions.expire(activeCheckoutSession.stripe_session_id)
    console.log('session cancelled')
    return new NextResponse('OK', {status: 200})
}
