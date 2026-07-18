"use client"
import { AuthWrapper } from "./components/authWrapper";
import { AuthProvider, useAuth } from "./context/authContext";
import { AppView } from "./app-view";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Drawing } from "./components/drawing/types";

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
        fetchAllDrawings
    } = useAuth();

  const pathname = usePathname();

  const noChrome = pathname === "/leaf-designer";

      const [drawings, setDrawings] = useState<Drawing[]>([])

      useEffect(() => {
          fetchAllDrawings().then(d => setDrawings(d))
      }, [fetchAllDrawings])
  
    
    return (
        <AppView
            isLoggedIn={!!user}
            logout={logout}
            noChrome={noChrome}
            footerDrawings={drawings}
        >
            {children}
        </AppView>
    );
}