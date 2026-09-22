import { ScreenHome } from '@/screens/Home/ScreenHome';
import { getHomeContent } from '@/services/pageContentService';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	// Home uses the layout's default title rather than the %s template.
	title: {
		absolute: 'Safe Haven Accommodations — Boys PG in Greater Noida',
	},
};

/**
 * The route is the controller: it fetches, the screen renders. Nothing below
 * this file knows the CMS exists.
 */
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
	const content = await getHomeContent();
	return <ScreenHome content={content} />;
}
