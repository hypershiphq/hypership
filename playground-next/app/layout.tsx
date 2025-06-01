import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { initDb } from "@hypership/db";

// Initialize the database package
initDb({
  apiBase: "http://localhost:3002",
  secretKey: "6aca536766b1c1695ddf1da32dda24611c05b879b049f2d1", // In production, use process.env.HYPERSHIP_SECRET_KEY!
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hypership DB Playground",
  description: "Testing @hypership/db package",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
