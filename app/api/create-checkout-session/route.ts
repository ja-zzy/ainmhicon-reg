import { CURRENT_CON_ID } from '@/app/utils/constants';
import { stripe } from '@/app/utils/private/stripe';
import { supabase } from '@/app/utils/private/supabase';

const regStartTime = Number(process.env.NEXT_PUBLIC_REG_START_TIME)
const overrideUserId = process.env.OVERRIDE_USER_ID

export async function POST(req: Request) {
    const { priceId, userId } = await req.json()

    if (userId !== overrideUserId && Date.now() < regStartTime) { return new Response(new Blob(), { status: 401, statusText: "Reg is not open yet" }) }

    // We shouldn't let a user pay again if they're already registered, that'd be complicated
    const { data: registration, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('user_id', userId)
        .eq('convention_id', CURRENT_CON_ID)
        .maybeSingle()

    const couponId = await getActiveCouponId();

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
            discounts: [{
                coupon: couponId,
            }],
            success_url: `${req.headers.get('origin')}/reg#confirmation`,
            cancel_url: `${req.headers.get('origin')}/dashboard#payment-cancelled`,
            metadata: { userId }
        })

        return Response.json({ sessionId: session.id })
    } catch {
        return new Response(new Blob(), { status: 500, statusText: "Stripe checkout error" })
    }
}

async function getActiveCouponId() {
    const coupons = await stripe.coupons.list();

    const earlyBird = coupons.data.find((c) => c.name === 'Early Bird Discount (Until Oct 4th)');
    if (earlyBird?.valid)
        return earlyBird.id;

    const standard = coupons.data.find((c) => c.name === 'Standard Fare (Until Jan 4th)');
    if (standard?.valid)
        return standard.id;
}
