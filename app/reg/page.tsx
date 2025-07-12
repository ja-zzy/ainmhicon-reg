"use client"

import { AuthWrapper } from '../components/authWrapper'

import { handleCheckout } from '../utils/public/stripe';
import { useAuth } from '../context/authContext';
import Loading from '../components/loading';
import { useState } from 'react';
import ErrorMessage from '../components/errorMessage';

export default function UserDetailsPage() {
    const { user } = useAuth()
    const [error, setError] = useState<string | null>(null)

    if (!user) { return <Loading /> }

    return (
        <AuthWrapper>
            <h2 className='font-[family-name:var(--font-sora)] text-xl'>
                Choose a ticket type
            </h2>
            <button className='btn' onClick={() => handleCheckout(user.id, 'price_1RiKMxQslLjui9q05yaSXxx5').catch(e => setError(e.message))}>Standard Weekend Ticket</button>
            <ErrorMessage error={error} />
        </AuthWrapper >
    )
}