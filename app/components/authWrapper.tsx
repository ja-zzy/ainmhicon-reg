'use client'
import { useAuth } from '../context/authContext'
import ErrorMessage from './errorMessage'
import Loading from './loading'

interface AuthWrapperProps {
  children?: React.ReactNode
  requireAuth?: boolean
  allowIncompleteProfile?: boolean
}

export function AuthWrapper({
  children,
}: AuthWrapperProps) {
  const { error, loading } = useAuth()

  if (error) {
    return <ErrorMessage error={error} />
  }
  // Show loading state
  if (loading) {
    return <Loading />
  }

  // All checks passed, render children
  return <>
    {children}
  </>
}
