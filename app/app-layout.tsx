"use client"
import { AuthWrapper } from "./components/authWrapper";
import { AuthProvider, useAuth } from "./context/authContext";
import { AppView } from "./app-view";

export function AppLayout({
    children,
    withAuth = true,
}: {
    children: React.ReactNode;
    withAuth?: boolean;
}) {
    const content = (
        <AuthWrapper>
            <AppLayoutConnectedContent>
                {children}
            </AppLayoutConnectedContent>
        </AuthWrapper>
    );

    return withAuth ? (
        <AuthProvider>
            {content}
        </AuthProvider>
    ) : (
        <AppLayoutConnectedContent>
            {children}
        </AppLayoutConnectedContent>
    );
}


function AppLayoutConnectedContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const {
        user,
        logout,
    } = useAuth();

    return (
        <AppView
            isLoggedIn={!!user}
            logout={logout}
        >
            {children}
        </AppView>
    );
}