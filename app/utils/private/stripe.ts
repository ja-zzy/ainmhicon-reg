import Stripe from "stripe";

// These keys are NOT SAFE to be exposed to the client. Please contact the maintainer _immediately_ if they are leaked and we can regenerate them.
const stripeSecretKey = process.env.STRIPE_SK
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET
const controlProductId = process.env.STRIPE_CONTROL_PRODUCT_ID

if (!stripeSecretKey || !STRIPE_WEBHOOK_SECRET || !controlProductId) { throw new Error('Missing stripe environment variables, ensure STRIPE_SK, STRIPE_WEBHOOK_SECRET, and STRIPE_CONTROL_PRODUCT_ID are set for this machine') }

export const stripe = new Stripe(stripeSecretKey);
export const stripeWebhookSecret = STRIPE_WEBHOOK_SECRET

export async function updateTicketStock(ticketType: string) {
    if (controlProductId) {
        try {
            const controlProduct = await stripe.products.retrieve(controlProductId)
            let ticketsSoldSaturday = parseInt(controlProduct.metadata["tickets_sold_sat"])
            let ticketsSoldSunday = parseInt(controlProduct.metadata["tickets_sold_sun"])

            if (ticketType.indexOf('Weekend') !== -1 || ticketType.indexOf('Founder') !== -1) {
                ticketsSoldSaturday += 1
                ticketsSoldSunday += 1
            } else if (ticketType.indexOf('Saturday') !== -1) {
                ticketsSoldSaturday += 1
            } else if (ticketType.indexOf('Sunday') !== -1) {
                ticketsSoldSunday += 1
            }

            await stripe.products.update(controlProductId, {
                metadata: {
                    tickets_sold_sat: ticketsSoldSaturday.toString(),
                    tickets_sold_sun: ticketsSoldSunday.toString(),
                }
            });
        } catch (e) {
            console.error("Encountered an error while trying to update ticket data")
        }
    }
}