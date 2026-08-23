import { getHotelCode } from "@/app/utils/private/supabase";
import { NextResponse } from "next/server";

export async function GET() {
    let hotelCode;
    try {
        hotelCode = await getHotelCode();
    } catch (error: any) {
        console.error('Error trying to get hotel code', error)
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }

    return NextResponse.json({ hotelCode });
}