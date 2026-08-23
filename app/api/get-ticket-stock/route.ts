import { NextResponse } from "next/server";
import { getTicketAvailability } from '@/app/utils/private/supabase';

export async function GET() {
    let tickets;
    try {
        tickets = await getTicketAvailability();
    } catch (error: any) {
        console.error('Error trying to get ticket availability', error)
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }


    return NextResponse.json(tickets);
}