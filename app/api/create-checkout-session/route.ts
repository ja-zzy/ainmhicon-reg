import { CURRENT_CON_ID, REG_START_TIME } from '@/app/utils/constants';
import { stripe } from '@/app/utils/private/stripe';
import { supabase } from '@/app/utils/private/supabase';

export async function POST(req: Request) {
    if (Date.now() < REG_START_TIME) { return new Response(new Blob(), { status: 401, statusText: "Reg is not open yet" }) }
    const { priceId, userId } = await req.json()

    // We shouldn't let a user pay again if they're already registered, that'd be complicated
    const { data: registration, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('user_id', userId)
        .eq('convention_id', CURRENT_CON_ID)
        .maybeSingle()

    if (error) {
        return new Response(new Blob(), { status: 500, statusText: "Error finding user with id " + userId })
    } else if (registration) {
        return new Response(new Blob(), { status: 401, statusText: "User is already registered" })
    }
    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                }
            ],
            mode: 'payment',
            success_url: `${req.headers.get('origin')}/payment-success`,
            cancel_url: `${req.headers.get('origin')}/dashboard#payment-cancelled`,
            metadata: { userId }
        })

        return Response.json({ sessionId: session.id })
    } catch {
        return new Response(new Blob(), { status: 500, statusText: "Stripe checkout error" })
    }
}