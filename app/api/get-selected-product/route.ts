import { stripe } from "@/app/utils/private/stripe";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const SqlString = require("sqlstring");
    const { searchParams } = new URL(req.url);
    const day = searchParams.get("day");
    const tier = searchParams.get("tier");

    if (!day || !tier) { return new NextResponse("Query params not included", { status: 400 }) }

    try {
        const result = await stripe.products.search({
            query: `active: \'true\' AND metadata[\'day\']: ${SqlString.escape(day)} AND metadata[\'tier\']: ${SqlString.escape(tier)}`,
            limit: 1
        })

        return NextResponse.json(result.data[0]);
    } catch (e) {
        console.error("Can't find product", e);
        return new NextResponse("Can't find product", { status: 500 });
    }
}