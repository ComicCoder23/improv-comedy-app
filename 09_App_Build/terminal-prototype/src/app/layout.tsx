import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Stage Manager // Scene Map",
  description: "A Harold in terminal form. Central Scotland Improv Scene.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-black">
      <body className="h-full w-full flex flex-col overflow-hidden bg-black">
        {children}
        <Script
          id="tally-js"
          src="https://tally.so/widgets/embed.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
