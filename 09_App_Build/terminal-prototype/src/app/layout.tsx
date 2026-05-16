import type { Metadata } from "next";
import type { Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Stage Manager // Scene Map",
  description: "A Harold in terminal form. Central Scotland Improv Scene.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ height: "100%", background: "#0A0A00" }}>
      <body style={{ height: "100%", margin: 0, padding: 0, background: "#0A0A00", overflow: "hidden" }}>
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
