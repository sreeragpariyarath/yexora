import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yexora | Next-Gen Spatial & Digital Innovations",
  description: "Pioneering the future of spatial computing, AI integration, and cutting-edge digital experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} h-full antialiased dark`}
    >
      <head>
        {/* Work videos are served from R2; open the connection early */}
        <link rel="preconnect" href="https://media.yexoraitsolutions.com" />
      </head>
      <body className="min-h-full flex flex-col bg-[#050713] text-zinc-100">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
