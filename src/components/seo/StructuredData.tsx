import { ADDRESS, CHAT, CONTACT, SITE_LEGAL_NAME } from '@/utils/SiteConfig';

const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000';

/**
 * Structured data for the business.
 *
 * `LodgingBusiness` rather than the generic `Organization`: it is the schema.org
 * type that actually describes accommodation, and it carries the fields Google
 * shows in a local result — address, phone, hours, price band. For a business
 * whose customers search "PG in Greater Noida", the local result IS the
 * homepage as far as most students are concerned.
 *
 * Everything here must stay true to what the site says. Structured data that
 * contradicts the page is worse than none.
 */
export function BusinessStructuredData() {
	const data = {
		'@context': 'https://schema.org',
		'@type': 'LodgingBusiness',
		'@id': `${siteUrl}/#business`,
		name: SITE_LEGAL_NAME,
		url: siteUrl,
		telephone: CONTACT.phoneDisplay,
		email: CONTACT.email,
		address: {
			'@type': 'PostalAddress',
			streetAddress: ADDRESS.line1,
			addressLocality: 'Greater Noida',
			addressRegion: 'Uttar Pradesh',
			addressCountry: 'IN',
		},
		areaServed: 'Greater Noida',
		openingHours: 'Mo-Su 09:00-20:00',
		sameAs: [CHAT.url],
		amenityFeature: [
			// Kept deliberately short and only what the site itself claims.
			{ '@type': 'LocationFeatureSpecification', name: 'Wi-Fi', value: true },
			{
				'@type': 'LocationFeatureSpecification',
				name: 'Housekeeping',
				value: true,
			},
		],
	};

	return (
		<script
			type="application/ld+json"
			// Serialised from a literal we control — no user input reaches this.
			// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD has no other injection point
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
		/>
	);
}

type Crumb = { name: string; path: string };

/** Breadcrumbs, so a result shows "safehaven › Property" rather than a raw URL. */
export function BreadcrumbStructuredData({ crumbs }: { crumbs: Crumb[] }) {
	const data = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [{ name: 'Home', path: '/' }, ...crumbs].map(
			(crumb, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				name: crumb.name,
				item: `${siteUrl}${crumb.path}`,
			}),
		),
	};

	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD has no other injection point
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
		/>
	);
}

type FaqEntry = { question: string; answer: string; confirmed: boolean };

/**
 * `FAQPage` structured data.
 *
 * Only confirmed answers are published, and that filter is the whole point of
 * the component. Structured data is what Google may show *instead* of the
 * page, so an unconfirmed answer here becomes a wrong answer quoted in a
 * search result, with no visible marker and no way for a reader to tell it was
 * a draft. Renders nothing at all if none are confirmed yet.
 */
export function FaqStructuredData({ faqs }: { faqs: FaqEntry[] }) {
	const publishable = faqs.filter(
		(faq) => faq.confirmed && faq.answer.trim().length > 0,
	);

	if (publishable.length === 0) {
		return null;
	}

	const data = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: publishable.map((faq) => ({
			'@type': 'Question',
			name: faq.question,
			acceptedAnswer: { '@type': 'Answer', text: faq.answer },
		})),
	};

	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD has no other injection point
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
		/>
	);
}
