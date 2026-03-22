import "./globals.css";
import { Inter, Sora } from "next/font/google";
import { AuthWrapper } from "./components/authWrapper";
import { AuthProvider } from "./context/authContext";

const interSans = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const soraSans = Sora({
    variable: "--font-sora",
    subsets: ["latin"],
});

export function AppLayout({
    children,
    withAuth = true,
}: Readonly<{
    children: React.ReactNode;
    withAuth?: boolean
}>) {

    const childrenInner = withAuth ? (
        <AuthWrapper>
            {children}
        </AuthWrapper>
    ) : children
    const content = (
        <div
            className={`${interSans.variable} ${soraSans.variable} antialiased`} data-theme="ainmhicon"
        >
            <div className="flex h-[100%] flex-col items-center justify-contet-space-between min-h-screen p-8 pt-0 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-inter)]">
                <main className="flex flex-col flex-grow gap-[32px] items-center sm:items-start">
                    <div className="w-[20rem] h-[calc(13rem)] flex justify-center mr-auto ml-auto mt-6 relative ">
                        <img
                            src='banner.webp'
                            alt="Logo"
                            className="w-[20rem] absolute"
                        />
                    </div>
                    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 pt-18 shadow-lg min-h-[50%] flex flex-col justify-center">
                        {childrenInner}
                    </fieldset>
                </main>
                <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
                    Copyright Ainmhícon 2025
                    Ainmhícon, Company Limited by Guarantee, Company No. 793565
                </footer>
            </div>
        </div >
    )

    return withAuth ? <AuthProvider>{content}</AuthProvider> : content
}