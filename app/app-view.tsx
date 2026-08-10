import "./globals.css";
import { Inter, Sora } from "next/font/google";
import NavBar from "./components/nav-bar";
import { Drawing } from "./components/drawing/types";
import { LeafArtwork } from "./components/drawing/leaf-svg";
import { useEffect } from "react";

const interSans = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const soraSans = Sora({
    variable: "--font-sora",
    subsets: ["latin"],
});


type AppViewProps = {
    children: React.ReactNode;
    isLoggedIn: boolean;
    logout: () => void;
    noChrome?: boolean;
    footerDrawings: Drawing[]
};

export function AppView({
    children,
    isLoggedIn,
    logout,
    noChrome,
    footerDrawings
}: AppViewProps) {
    return (
        <div
            className={`${interSans.variable} ${soraSans.variable} antialiased`}
            data-theme="ainmhicon"
        >
            <NavBar
                loggedIn={isLoggedIn}
                logout={logout}
            />

            <div className="flex h-[100%] flex-col items-center justify-contet-space-between p-8 pt-0 pb-20 gap-16 font-[family-name:var(--font-inter)]">
                <main className="flex flex-col flex-grow gap-[32px] items-center">
                    {!noChrome && (
                    <div className="w-[20rem] sm:w-[25rem] flex justify-center mr-auto ml-auto mt-6 relative mb-[-89px] sm:mb-[-103px] min-h-45">
                        <img
                            src="roots.webp"
                            alt="Logo"
                            className="w-[20rem] sm:w-[25rem] z-1"
                        />
                    </div>
                    )}
                    <fieldset className={noChrome ? '' : 'fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 pt-12 sm:pt-16 pb-6 shadow-lg flex flex-col justify-center min-h-9 relative'}>
                        {children}
                    </fieldset>
                </main>

                <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-center mt-9 pointer-fine:mt-0">
                    Copyright Ainmhicon 2026<br/><br/>

                    Ainmhícon, Company Limited by Guarantee, Company No. 793565
                </footer>
            </div>
        </div>
    );
}