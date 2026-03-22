"use client"

import { useRouter } from 'next/navigation'
import { useAuth } from '../context/authContext'
import { AuthWrapper } from '../components/authWrapper'
import { UserDetailsView } from './view'

export default function UserDetailsPage() {
    const authProps = useAuth()

    const router = useRouter()
    const redirect = () => router.push('/dashboard')

    return (
        <AuthWrapper requireAuth={true} allowIncompleteProfile={true}>
            <UserDetailsView {...authProps} onRedirect={redirect} updatesDisabled={true} />
        </AuthWrapper >
    )
}
