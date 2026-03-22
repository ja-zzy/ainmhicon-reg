import type { Metadata } from "next";
import { AppLayout } from "./app-layout";


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
    <html lang="en">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
