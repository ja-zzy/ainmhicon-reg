import type { Metadata } from "next";
import { AppLayout } from "./app-layout";


export const metadata: Metadata = {
  title: "Ainmhícon Registration",
  description: "Register for Ainmhícon 2027!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8"/>
        <meta name='robots' content='noindex'/>
      </head>
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
