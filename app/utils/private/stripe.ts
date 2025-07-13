import Stripe from "stripe";

// These keys are NOT SAFE to be exposed to the client. Please contact the maintainer _immediately_ if they are leaked and we can regenerate them.
const stripeSecretKey = process.env.STRIPE_SK
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET

if (!stripeSecretKey || !STRIPE_WEBHOOK_SECRET) { throw new Error('Missing stripe environment variables, ensure STRIPE_SK and STRIPE_WEBHOOK_SECRET are set for this machine') }

export const stripe = new Stripe(stripeSecretKey);
export const stripeWebhookSecret = STRIPE_WEBHOOK_SECRET