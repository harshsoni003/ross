import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
        <link rel="stylesheet" href="/_next/static/css/app/layout.css" />
      </head>
      <body className="bg-gray-900 text-white" style={{backgroundColor: '#111827', color: '#ffffff'}}>
        {children}
      </body>
    </html>
  );
}
