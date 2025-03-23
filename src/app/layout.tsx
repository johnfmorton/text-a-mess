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

// Define your site URL based on the environment
const siteUrl =
  process.env.NODE_ENV === "production"
    ? "https://text-a-mess.supergeekery.com"
    : "http://localhost:3000";

export const metadata: Metadata = {
  title: 'Text-A-Mess',
  description: 'Let your text reflect your inner chaos.',
  openGraph: {
    title: 'Text-a-Mess',
    description: 'Let your text reflect your inner chaos.',
    images: [
      {
        url: `${siteUrl}/text-a-mess-social-1280x640.png`,
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
