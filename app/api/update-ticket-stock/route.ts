import { stripe } from "@/app/utils/private/stripe";
import { NextResponse } from "next/server";

const controlProductId = process.env.STRIPE_CONTROL_PRODUCT_ID

export async function POST(req: Request) {
    if (!controlProductId) { throw new Error('Missing Stripe Control Product ID environment variable, ensure STRIPE_CONTROL_PRODUCT_ID is set for this machine') }
    try {
        const ticketType = await req.json()
        const controlProduct = await stripe.products.retrieve(controlProductId)
        let ticketsSoldSaturday = parseInt(controlProduct.metadata["tickets_sold_sat"])
        let ticketsSoldSunday = parseInt(controlProduct.metadata["tickets_sold_sun"])

        switch (ticketType) {
            case "Ainmhícon 2026 - Weekend Standard Ticket":
            case "Ainmhícon 2026 - Weekend Sponsor Ticket":
            case "Ainmhícon 2026 - Founder Package":
                ticketsSoldSaturday++
                ticketsSoldSunday++
                break;
            case "Ainmhícon 2026 - Day Pass Saturday Standard Ticket":
            case "Ainmhícon 2026 - Day Pass Saturday Sponsor Ticket":
                ticketsSoldSaturday++
                break;
            case "Ainmhícon 2026 - Day Pass Sunday Standard Ticket":
            case "Ainmhícon 2026 - Day Pass Sunday Sponsor Ticket":
                ticketsSoldSunday++
                break;
            default:
                break;
        }

        await stripe.products.update(controlProductId, {
            metadata: {
                tickets_sold_sat: ticketsSoldSaturday.toString(),
                tickets_sold_sun: ticketsSoldSunday.toString(),
            }
        });
    } catch (e) {
        console.error("Encountered an error while trying to update ticket data")
        return new NextResponse("Encountered an error while trying to update ticket data", { status: 500 })
    }
    return new NextResponse(null, { status: 200 });
}