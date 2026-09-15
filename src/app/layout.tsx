import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Self-hosted so builds never depend on reaching Google, and no request is
// made to Google from the visitor's browser. See src/app/fonts/README.md.
const dmSans = localFont({
  variable: "--font-dm-sans",
  display: "swap",
  src: [
    {
      path: "./fonts/dm-sans-variable.woff2",
      weight: "100 1000",
      style: "normal",
    },
    {
      path: "./fonts/dm-sans-variable-italic.woff2",
      weight: "100 1000",
      style: "italic",
    },
  ],
});

const playfairDisplay = localFont({
  variable: "--font-playfair",
  display: "swap",
  src: [
    {
      path: "./fonts/playfair-display-variable.woff2",
      weight: "400 900",
      style: "normal",
    },
  ],
});

const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";

const siteName = "Safe Heaven Accomodations";
const siteDescription =
  "Secure, all-inclusive rooms for students and working professionals. Browse verified properties, compare pricing and amenities, and book your stay in minutes.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Student Housing & Co-Living in India`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "student accommodation",
    "co-living",
    "PG for students",
    "hostel",
    "student housing India",
    "single room",
    "shared room",
  ],
  authors: [{ name: siteName }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName,
    title: `${siteName} — Student Housing & Co-Living in India`,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — Student Housing & Co-Living in India`,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      className={`${dmSans.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
