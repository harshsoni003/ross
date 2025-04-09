import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { geist } from '@vercel/fonts';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Travel Planner AI",
  description: "AI-powered travel planning assistant",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
<<<<<<< HEAD
      <body>
=======
      <body className="bg-gray-900 text-white">
>>>>>>> c10c0025080ed35600f0c59271e3b9f33476a123
        {children}
      </body>
    </html>
  );
}
