import { BreadcrumbStructuredData } from '@/components/seo/StructuredData';
import { ScreenAbout } from '@/screens/About/ScreenAbout';
import { getAboutContent } from '@/services/pageContentService';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'About us',
	description:
		'Why we started Safe Haven Accommodations, the people who run the building, and what we hold to.',
	alternates: { canonical: '/about' },
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
	const content = await getAboutContent();

	return (
		<>
			<BreadcrumbStructuredData
				crumbs={[{ name: 'About Us', path: '/about' }]}
			/>
			<ScreenAbout content={content} />
		</>
	);
}
