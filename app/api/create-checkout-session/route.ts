import { stripe } from '@/app/utils/private/stripe';

export async function POST(req: Request) {
    const { priceId, userId } = await req.json()
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
            cancel_url: `${req.headers.get('origin')}/dashboard#payment-cancel`,
            metadata: { userId }
        })

        return Response.json({ sessionId: session.id })
    } catch {
        return new Response(new Blob(), { status: 500, statusText: "Stripe checkout error" })
    }
}