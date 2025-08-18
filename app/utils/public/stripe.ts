import { loadStripe } from "@stripe/stripe-js";

const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PK

if (!stripePublicKey) { throw new Error('Missing supabase environment variables, ensure NEXT_PUBLIC_STRIPE_PK is set for this machine') }

const stripePromise = loadStripe(stripePublicKey);

export async function handleCheckout(userId: string, priceId: string) {
    const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, userId })
    })
    if (res.status !== 200) { throw new Error(res.statusText) }
    const { sessionId } = await res.json();
    const stripe = await stripePromise;
    await stripe?.redirectToCheckout({ sessionId })
}

export async function getSelectedProduct(day: string, tier: string) {
    const res = await fetch(`/api/get-selected-product?day=${encodeURIComponent(day)}&tier=${encodeURIComponent(tier)}`, {
        method: 'GET',
    })

    if (res.status !== 200) { throw new Error(res.statusText) }

    return res;
}

export async function getTicketStock() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/get-ticket-stock`, {method: 'GET'})

    if (res.status !== 200) { throw new Error(res.statusText) }

    return await res.json();
}