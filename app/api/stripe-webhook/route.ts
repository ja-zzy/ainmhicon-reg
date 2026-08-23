import Stripe from 'stripe';

import { NextResponse } from 'next/server';
import { stripe, stripeWebhookSecret } from '@/app/utils/private/stripe';
import { addTicketToDays, clearUserCheckout, supabase } from '@/app/utils/private/supabase';
import { getDayValue } from '@/app/utils/day-mapping';
import { CURRENT_CON_ID } from '@/app/utils/constants';

export async function POST(req: Request) {
    const rawBody = Buffer.from(await req.arrayBuffer())

    let event: Stripe.Event;
    // Verify request is legit
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
        console.error('No stripe signiature provided in webhook header')
        return new NextResponse('Not allowed', { status: 400 })
    }
    try {
        event = stripe.webhooks.constructEvent(rawBody, signature, stripeWebhookSecret)
    } catch {
        console.error(`Received bad event from stripe, signature verification failed!`)
        return new NextResponse('Not allowed', { status: 400 })
    }

    if (!isCheckoutSessionEvent(event)) {
        return new NextResponse('Ignored', { status: 200 });
    }

    const userId = event.data.object.metadata?.['userId']

    if (!userId) {
        console.error(`Received ${event.type} with no user id. Cannot update supabase`)
        return new NextResponse('Missing UserID from Metadata!', { status: 500 })
    }

    await clearUserCheckout(userId)
    switch (event.type) {
        case 'checkout.session.async_payment_succeeded':
        case 'checkout.session.completed':
            const lineItems = await stripe.checkout.sessions.listLineItems(event.data.object.id);
            const ticketType = lineItems.data[0]?.description || 'Unknown';

            const { error } = await supabase
                .from('registrations')
                .upsert({ user_id: userId, payment_status: 'paid', convention_id: CURRENT_CON_ID, ticket_type: ticketType })

            if (error) {
                console.error('Supabase error when updating paid status', error);
                return new NextResponse('Error updating registration', { status: 500 });
            }

            break;

        case 'checkout.session.async_payment_failed':
        case 'checkout.session.expired':
            const cancellationLineItems = await stripe.checkout.sessions.listLineItems(
                event.data.object.id,
                {
                    expand: ['data.price.product'],
                }
            );

            const product = cancellationLineItems.data[0].price?.product;

            if (typeof product !== 'object' || product === null || product.deleted) {
                console.error('Cannot cancel checkout session, product information could not be fetched', product);
                return new NextResponse('Product information not found for cancellation', { status: 500 })
            }

            const ticketDay = product.metadata.day;
            await addTicketToDays(ticketDay === 'full-event' ? null : getDayValue(ticketDay))
            break;
    }
    return new NextResponse('OK', { status: 200 })
}


function isCheckoutSessionEvent(
    event: Stripe.Event
): event is Stripe.Event & {
    data: { object: Stripe.Checkout.Session }
} {
    return (
        event.type === 'checkout.session.async_payment_succeeded' ||
        event.type === 'checkout.session.completed' ||
        event.type === 'checkout.session.async_payment_failed' ||
        event.type === 'checkout.session.expired'
    );
}