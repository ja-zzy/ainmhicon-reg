import { CURRENT_CON_ID } from '@/app/utils/constants';
import { days, getDayValue } from '@/app/utils/day-mapping';
import { stripe } from '@/app/utils/private/stripe';
import { getTicketAvailability, getActiveCheckoutSession, isUserRegistered, removeTicketFromDays, startUserCheckout, supabase } from '@/app/utils/private/supabase';
import { NextResponse } from 'next/server';

const regStartTime = Number(process.env.NEXT_PUBLIC_REG_START_TIME)
const regEndTime = Number(process.env.NEXT_PUBLIC_REG_END_TIME)
const overrideUserId = process.env.OVERRIDE_USER_ID
const cocLink = process.env.CODE_OF_CONDUCT_LINK

export async function POST(req: Request) {
    const { priceId, userId, selectedDay } = await req.json()

    if (userId !== overrideUserId && Date.now() < regStartTime) { return new Response(new Blob(), { status: 401, statusText: "Reg is not open yet" }) }
    if (Date.now() > regEndTime) { return new Response(new Blob(), { status: 401, statusText: "Reg is now closed" }) }

    // Only let users who are fully registered buy a ticket
    const { data: registration, error: regError } = await isUserRegistered(userId)
    if (regError) {
        return new NextResponse(`Error finding user with id ${userId}`, { status: 500 })
    } else if (registration) {
        return new NextResponse(`User with id ${userId} is already registered`, { status: 401 })
    }

    // Don't let the user start another checkout session, otherwise an attacker could quickly drain the ticket stock
    const userCheckingOut = await getActiveCheckoutSession(userId) != null
    if (userCheckingOut) {
        return new NextResponse(`User with id ${userId} is already in a checkout session`, { status: 401 })
    }
    let ticketStock;
    try {
        ticketStock = new Set(await getTicketAvailability());
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }

    const fridaySoldOut = !ticketStock.has(days.friday)
    const saturdaySoldOut = !ticketStock.has(days.saturday)
    const sundaySoldOut = !ticketStock.has(days.sunday)
    const weekendSoldOut = fridaySoldOut || saturdaySoldOut || sundaySoldOut
    const dayIndex = getDayValue(selectedDay.toLowerCase())
    const selectedDaySoldOut =
        selectedDay === "Full-Event"
            ? weekendSoldOut
            : !ticketStock.has(dayIndex)

    if (selectedDaySoldOut) {
    console.log(ticketStock, selectedDay)
        return new NextResponse(`Sorry, tickets for ${selectedDay} have sold out and are no longer in stock`, { status: 410 })
    }

    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                }
            ],
            mode: 'payment',
            discounts: [],
            success_url: `${req.headers.get('origin')}/reg#confirmation`,
            cancel_url: `${req.headers.get('origin')}/dashboard#payment-cancelled`,
            metadata: { userId },
            consent_collection: {
                terms_of_service: 'required',
            },
            custom_text: {
                terms_of_service_acceptance: {
                    message: `I agree to Ainmhícon's [Code of Conduct](${cocLink})`,
                },
            },
            expires_at: Math.floor(Date.now() / 1000) + 1820, // checkout session expires ~30 minutes after creation
        })

        await startUserCheckout(userId, session.id)
        await removeTicketFromDays(selectedDay === 'Full-Event' ? null : dayIndex)
        return NextResponse.json({ sessionId: session.id })
    } catch {
        return new NextResponse("Stripe checkout error", { status: 500 })
    }
}
