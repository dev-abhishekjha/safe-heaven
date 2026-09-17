import { BreadcrumbStructuredData } from '@/components/seo/StructuredData';
import { ScreenProperty } from '@/screens/Property/ScreenProperty';
import { getPropertyContent } from '@/services/pageContentService';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'The property',
	description:
		'Single, double and triple sharing rooms at Safe Heaven, Mitra Enclave, Sector P7 — furnished, all-inclusive rent, three minutes from Knowledge Park II Metro.',
	alternates: { canonical: '/property' },
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
	const content = await getPropertyContent();

	return (
		<>
			<BreadcrumbStructuredData
				crumbs={[{ name: 'Property', path: '/property' }]}
			/>
			<ScreenProperty content={content} />
		</>
	);
}
