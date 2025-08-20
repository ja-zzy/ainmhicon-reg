import { stripe } from "@/app/utils/private/stripe";
import { NextResponse } from "next/server";

const controlProductId = process.env.STRIPE_CONTROL_PRODUCT_ID

export async function GET() {
    if (!controlProductId) { throw new Error('Missing Stripe Control Product ID environment variable, ensure STRIPE_CONTROL_PRODUCT_ID is set for this machine') }
    try {
        const controlProduct = await stripe.products.retrieve(controlProductId)
        return NextResponse.json(controlProduct.metadata)
    } catch (e) {
        console.error("Cannot get ticket information")
        return new NextResponse("Cannot get ticket information", { status: 500 });
    }
}