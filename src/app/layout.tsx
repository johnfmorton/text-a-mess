import type { Metadata } from "next";
import { Geist_Mono, Kablammo } from 'next/font/google';
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const kablammo = Kablammo({
  variable: "--font-kablammo",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${kablammo.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
