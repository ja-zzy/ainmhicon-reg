import Stripe from 'stripe';

import { NextResponse } from 'next/server';
import { stripe, stripeWebhookSecret } from '@/app/utils/private/stripe';
import { supabase } from '@/app/utils/private/supabase';
import { updateTicketStock } from '@/app/utils/public/stripe';

export async function POST(req: Request) {
    const rawBody = Buffer.from(await req.arrayBuffer())

    let event: Stripe.Event;
    // Verify request is legit
    const signature = req.headers.get('stripe-signature')
    if (!signature) { return new NextResponse('Not allowed', { status: 400 }) }

    try {
        event = stripe.webhooks.constructEvent(rawBody, signature, stripeWebhookSecret)
    } catch {
        console.error(`Received bad event from stripe, signature verification failed!`)
        return new NextResponse('Not allowed', { status: 400 })
    }

    console.log(event)
    switch (event.type) {
        case 'checkout.session.async_payment_succeeded':
        case 'checkout.session.completed':
            const userId = event.data.object.metadata?.['userId']

            if (!userId) {
                console.error(`Received ${event.type} with no user id. Cannot update supabase`)
                return new NextResponse('Missing UserID from Metadata!', { status: 500 })
            }

            const lineItems = await stripe.checkout.sessions.listLineItems(event.data.object.id);
            const ticketType = lineItems.data[0]?.description || 'Unknown';
            await updateTicketStock(ticketType);
            
            const { error } = await supabase
            .from('registrations')
            .upsert({ user_id: userId, payment_status: 'paid', convention_id: 1, ticket_type: ticketType })
            
            if (error) {
                console.error('Supabase error when updating paid status', error);
                return new NextResponse('Error updating registration', { status: 500 });
            }

            break;
    }

    return new NextResponse('OK', { status: 200 })
}