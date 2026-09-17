import {
	BreadcrumbStructuredData,
	FaqStructuredData,
} from '@/components/seo/StructuredData';
import { ScreenFaq } from '@/screens/Faq/ScreenFaq';
import { getFaqContent } from '@/services/pageContentService';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'FAQ',
	description:
		'Rent, deposits, room types, visitors and moving in — the questions we are asked most about Safe Heaven Accomodations in Greater Noida.',
	alternates: { canonical: '/faq' },
};

/**
 * Regenerate at most once a minute.
 *
 * Without this the page is prerendered at build time and then frozen: a CMS
 * edit would not appear until the next deploy, which defeats the point of
 * having a CMS. Sixty seconds is a deliberate compromise — it keeps the page
 * static and fast for the overwhelming majority of requests while capping how
 * stale it can be.
 *
 * E3.19 replaces this with cache tags and `revalidateTag` on publish, which
 * makes an edit appear immediately instead of within a minute.
 */
export const revalidate = 60;

export default async function Page() {
	const faqs = await getFaqContent();

	return (
		<>
			<BreadcrumbStructuredData crumbs={[{ name: 'FAQ', path: '/faq' }]} />
			{/* Publishes only confirmed answers — see FaqStructuredData. */}
			<FaqStructuredData faqs={faqs} />
			<ScreenFaq faqs={faqs} />
		</>
	);
}
