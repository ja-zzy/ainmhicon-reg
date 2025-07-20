import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { AuthProvider } from './context/authContext'
import { AuthWrapper } from "./components/authWrapper";

const interSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const soraSans = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ainmhícon Registration",
  description: "Register for Ainmhícon 2026!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="ainmhicon">
      <body
        className={`${interSans.variable} ${soraSans.variable} antialiased`}
      >
        <AuthProvider>
          <div className="flex h-100 flex-col items-center justify-contet-space-between min-h-screen p-8 pt-0 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-inter)]">
            <main className="flex flex-col flex-grow gap-[32px] items-center sm:items-start">
              <div className="w-[20rem] h-[calc(13rem)] flex justify-center mr-auto ml-auto mt-6 relative ">
                <img
                  src='banner.webp'
                  alt="Logo"
                  className="w-[20rem] absolute"
                />
              </div>
              <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 pt-18 shadow-lg min-h-[50%] flex flex-col justify-center">
                <AuthWrapper>
                  {children}
                </AuthWrapper>
              </fieldset>
            </main>
            <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
              Copyright Ainmhicon 2025
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
