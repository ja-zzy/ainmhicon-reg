"use client"

import { AuthWrapper } from '../components/authWrapper'

import { handleCheckout } from '../utils/stripeCheckoutUtil';
import { useAuth } from '../context/authContext';
import Loading from '../components/loading';

export default function UserDetailsPage() {
    const { user } = useAuth()

    if (!user) { return <Loading /> }

    return (
        <AuthWrapper>
            <h2 className='font-[family-name:var(--font-sora)] text-xl'>
                Choose a ticket type
            </h2>
            <button className='btn' onClick={() => handleCheckout(user.id, 'price_1RiKMxQslLjui9q05yaSXxx5')}>Standard Weekend Ticket</button>
        </AuthWrapper >
    )
}