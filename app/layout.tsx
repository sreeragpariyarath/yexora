import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Poppins } from "next/font/google";
import "./globals.css";
import Loader from "@/components/Loader";
import SmoothScroll from "@/components/SmoothScroll";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL, THEME_COLOR } from "@/lib/site";

const poppins = Poppins({
  variable: "--font-poppins-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Display font for the menu overlay. Self-hosted by next/font (no render-blocking Google
// Fonts stylesheet); only preloaded on demand since the menu is closed at first.
const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
  preload: false,
});

const TITLE = `${SITE_NAME} | ${SITE_TAGLINE}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Yexora IT Solutions",
    "software development",
    "web development",
    "mobile app development",
    "AR VR XR development",
    "AI and machine learning",
    "cloud and DevOps",
    "IT company India",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    locale: "en_IN",
    title: TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: THEME_COLOR,
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${bebasNeue.variable} h-full antialiased dark`}
    >
      <head>
        {/* Work videos are served from R2; open the connection early */}
        <link rel="preconnect" href="https://media.yexoraitsolutions.com" />
      </head>
      <body className="min-h-full flex flex-col bg-[#000000] text-zinc-100">
        {/* Without JavaScript nothing would ever lift the loading screen */}
        <noscript dangerouslySetInnerHTML={{ __html: "<style>#site-loader{display:none}</style>" }} />
        <SmoothScroll>
          <Loader />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
