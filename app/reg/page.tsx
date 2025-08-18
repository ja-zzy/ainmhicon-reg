import { getTicketStock as getTicketStock } from "../utils/public/stripe";
import RegPage from "./pageClient";

export default async function RegTicketStock() {
    const data = await getTicketStock()

    const saturdayDisabled = parseInt(data.tickets_sold_sat) > parseInt(data.venue_capacity_sat)
    const sundayDisabled = parseInt(data.tickets_sold_sun) > parseInt(data.venue_capacity_sun)

    return (
        <RegPage
            saturdayDisabled={saturdayDisabled}
            sundayDisabled={sundayDisabled}
        />
    )
}