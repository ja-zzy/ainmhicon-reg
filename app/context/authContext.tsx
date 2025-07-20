'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { Attendee, RegistrationInfo } from '../utils/types'
import { supabase } from '../utils/public/supabase'
import { CURRENT_CON_ID } from '../utils/constants'

interface AuthState {
    user: User | null
    attendee: Attendee | null
    registration: RegistrationInfo | null
    loading: boolean
    error: string | null
}

interface AuthContextType extends AuthState {
    requireAuth: (allowIncompleteProfile?: boolean) => { authorized: boolean; loading: boolean }
    updateProfile: (updates: Partial<Attendee>) => Promise<void>
    logout: () => Promise<void>
    isAuthenticated: boolean
    hasCompleteProfile: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        attendee: null,
        registration: null,
        loading: true,
        error: null
    })
    useEffect(() => {
        console.log('AuthProvider mounted')
        return () => console.log('AuthProvider unmounted')
    }, [])
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession()

                if (error) {
                    setAuthState(prev => ({ ...prev, error: error.message, loading: false }))
                    return
                }
                if (session?.user) {
                    setAuthState(prev => ({ ...prev, user: session.user }))
                    await fetchUserProfile(session.user)
                    await fetchRegistration(session.user)
                    setAuthState(prev => ({ ...prev, loading: false }))
                } else {
                    setAuthState({ user: null, attendee: null, registration: null, loading: false, error: null })
                }
            } catch (err) {
                setAuthState(prev => ({
                    ...prev,
                    error: err instanceof Error ? err.message : 'Unknown error',
                    loading: false
                }))
            }
        }
        getInitialSession()

    }, [supabase, router])

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                const currentUserId = authState.user?.id
                if (event === 'SIGNED_IN' && session?.user && session.user.id !== currentUserId) {
                    await fetchUserProfile(session.user)
                } else if (event === 'SIGNED_OUT') {
                    setAuthState({ user: null, attendee: null, registration: null, loading: false, error: null })
                    router.replace('/login')
                }
            }
        )
        return () => { subscription.unsubscribe(); }
    }, [router, authState])

    // Auto-redirect effect - only runs once at the provider level
    useEffect(() => {
        const { user, attendee, loading } = authState

        // Don't redirect while loading
        if (loading) return

        // Not authenticated - redirect to login (except if already on login)
        if (!user) {
            router.replace('/login')
            return
        }

        // Authenticated but incomplete profile - redirect to user-details
        if (user && (!attendee || !attendee.first_name)) {
            if (pathname !== '/user-details') {
                router.push('/user-details')
            }
            return
        }

        // Authenticated with complete profile
        if (user && attendee && attendee.first_name) {
            if (pathname === '/login' || pathname === '/') {
                router.push('/dashboard')
                return
            }
        }
    }, [authState.user, authState.attendee, authState.loading, pathname, router])

    const fetchUserProfile = async (user: User) => {
        try {
            console.log('fetch user profile')
            setAuthState(prev => ({ ...prev, loading: true }))

            const { data: attendee, error } = await supabase
                .from('attendees')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle()

            if (error) {
                setAuthState(prev => ({
                    ...prev,
                    error: error.message,
                    loading: false
                }))
                return
            }

            setAuthState(prev => ({ ...prev, attendee }))
        } catch (err) {
            setAuthState(prev => ({
                ...prev,
                error: err instanceof Error ? err.message : 'Failed to fetch profile',
                loading: false
            }))
        }
    }

    const fetchRegistration = async (user: User) => {
        try {
            console.log('fetch user con registration')
            setAuthState(prev => ({ ...prev, loading: true }))

            const { data: registration, error } = await supabase
                .from('registrations')
                .select('*')
                .eq('user_id', user.id)
                .eq('convention_id', CURRENT_CON_ID)
                .maybeSingle()

            if (error) {
                setAuthState(prev => ({
                    ...prev,
                    error: error.message,
                    loading: false
                }))
                return
            }

            setAuthState(prev => ({ ...prev, registration }))
        } catch (err) {
            setAuthState(prev => ({
                ...prev,
                error: err instanceof Error ? err.message : 'Failed to fetch registration',
                loading: false
            }))
        }
    }
    const requireAuth = (allowIncompleteProfile = false) => {
        const { user, attendee, loading } = authState

        if (loading) return { authorized: false, loading: true }

        if (!user) {
            return { authorized: false, loading: false }
        }

        if (!allowIncompleteProfile && (!attendee || !attendee.first_name)) {
            return { authorized: false, loading: false }
        }

        return { authorized: true, loading: false }
    }

    const updateProfile = async (updates: Partial<Attendee>) => {
        if (!authState.user) return

        try {
            const { data: attendee, error } = await supabase
                .from('attendees')
                .upsert({ user_id: authState.user.id, ...updates })
                .eq('user_id', authState.user.id)
                .select()
                .single()

            if (error) throw error

            // Refresh profile data
            setAuthState(prev => ({ ...prev, attendee }))
        } catch (err) {
            setAuthState(prev => ({
                ...prev,
                error: err instanceof Error ? err.message : 'Failed to update profile'
            }))
        }
    }
    const logout = async () => {
        await supabase.auth.signOut()
        setAuthState(prev => ({ ...prev, attendee: null, user: null }))
    }
    const contextValue: AuthContextType = {
        ...authState,
        requireAuth,
        updateProfile,
        logout,
        isAuthenticated: !!authState.user,
        hasCompleteProfile: !!(authState.user && authState.attendee?.first_name)
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}