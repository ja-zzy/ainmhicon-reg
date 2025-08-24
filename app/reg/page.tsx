import { getTicketStock as getTicketStock } from "../utils/public/stripe";
import RegPageForm from "./regPageForm";

export default async function RegTicketStock() {
    const data = await getTicketStock()

    const ticketsSoldSat = parseInt(data.tickets_sold_sat)
    const venueCapacitySat = parseInt(data.venue_capacity_sat)
    const saturdayDisabled = ticketsSoldSat >= venueCapacitySat

    const ticketsSoldSun = parseInt(data.tickets_sold_sun)
    const venueCapacitySun = parseInt(data.venue_capacity_sun)
    const sundayDisabled = ticketsSoldSun >= venueCapacitySun


    return (
        <RegPageForm
            saturdayDisabled={saturdayDisabled}
            sundayDisabled={sundayDisabled}
        />
    )
}