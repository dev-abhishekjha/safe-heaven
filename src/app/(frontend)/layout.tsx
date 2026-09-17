import { EnquiryProvider } from '@/components/enquiry/EnquiryProvider';
import { ChatButton } from '@/components/layout/ChatButton';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { MobileActionBar } from '@/components/layout/MobileActionBar';
import { BusinessStructuredData } from '@/components/seo/StructuredData';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

// Self-hosted so builds never depend on reaching Google, and no request is
// made to Google from the visitor's browser. See src/app/(frontend)/fonts.
const dmSans = localFont({
	variable: '--font-dm-sans',
	display: 'swap',
	src: [
		{
			path: './fonts/dm-sans-variable.woff2',
			weight: '100 1000',
			style: 'normal',
		},
		{
			path: './fonts/dm-sans-variable-italic.woff2',
			weight: '100 1000',
			style: 'italic',
		},
	],
});

const playfairDisplay = localFont({
	variable: '--font-playfair',
	display: 'swap',
	src: [
		{
			path: './fonts/playfair-display-variable.woff2',
			weight: '400 900',
			style: 'normal',
		},
	],
});

const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000';

const siteName = 'Safe Heaven Accomodations';
const siteDescription =
	'Boys-only PG in Greater Noida — furnished single, double and triple rooms at Mitra Enclave, Sector P7, a three-minute walk from Knowledge Park II Metro.';

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: `${siteName} — Boys PG in Greater Noida`,
		template: `%s | ${siteName}`,
	},
	description: siteDescription,
	applicationName: siteName,
	keywords: [
		'boys PG Greater Noida',
		'PG near Knowledge Park II',
		'student accommodation Greater Noida',
		'hostel near Sharda University',
		'PG near Galgotias College',
		'single room PG',
	],
	authors: [{ name: siteName }],
	openGraph: {
		type: 'website',
		locale: 'en_IN',
		url: siteUrl,
		siteName,
		title: `${siteName} — Boys PG in Greater Noida`,
		description: siteDescription,
	},
	twitter: {
		card: 'summary_large_image',
		title: `${siteName} — Boys PG in Greater Noida`,
		description: siteDescription,
	},
	robots: { index: true, follow: true },
	alternates: { canonical: '/' },
};

export default function FrontendLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html
			lang="en-IN"
			className={`${dmSans.variable} ${playfairDisplay.variable} h-full antialiased`}
		>
			<body className="flex min-h-full flex-col">
				{/* First tab stop — lets keyboard users skip the nav on every page. */}
				<a
					href="#main"
					className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-field focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white"
				>
					Skip to content
				</a>

				<BusinessStructuredData />

				<EnquiryProvider>
					<Header />

					{/* Bottom padding clears the fixed mobile action bar. */}
					<main id="main" className="flex-1 pb-24 md:pb-0">
						{children}
					</main>

					<Footer />
					<MobileActionBar />
					<ChatButton />
				</EnquiryProvider>
			</body>
		</html>
	);
}
