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
  title: 'Text-A-Mess',
  description: 'Let your text reflect your inner chaos.',
  openGraph: {
    title: 'Text-a-Mess',
    description: 'Let your text reflect your inner chaos.',
    images: [
      {
        url: '/text-a-mess-social-1280x640.png',
        width: 1280,
        height: 640,
        alt: 'Text-a-Mess Social Image',
      },
    ],
  },
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
