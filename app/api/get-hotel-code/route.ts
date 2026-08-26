import { isUserRegistered } from "@/app/utils/private/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { userId } = await req.json()
    const { data, error } = await isUserRegistered(userId)
    if(error) {
        console.error("Error fetching registration data for user", userId)
        return new NextResponse("Could not retrieve registration data", { status: 401 })
    }
    if(data.payment_status !== 'paid') {
        console.error("User without paid registration attempted to access discount code", userId)
        return new NextResponse("Only paid attendees can receive the discount code", {status: 401})
    }
    const hotelCode = process.env.HOTEL_DISCOUNT_CODE
    return NextResponse.json({ hotelCode });
}
