import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe('pk_test_51RZVRiQslLjui9q0o9lGDkJCewdUJXBG4ElapMIWGc1wAxBKpr5Nogs1IokzzpRJO4sv79IfUfb6x9hE1kBiTsLk00VSQ3Z9Tl');

export async function handleCheckout(userId: string, priceId: string) {
    const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, userId })
    })

    const { sessionId } = await res.json();
    const stripe = await stripePromise;
    await stripe?.redirectToCheckout({ sessionId })
}