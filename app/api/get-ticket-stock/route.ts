import { stripe } from "@/app/utils/private/stripe";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const controlProduct = await stripe.products.retrieve('prod_StDqDHrmP7fyhx')

        return NextResponse.json(controlProduct.metadata)
    } catch (e) {
        console.error("Cannot get ticket information")
        return new NextResponse("Cannot get ticket information", { status: 500 });
    }
}