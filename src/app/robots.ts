import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000';

/**
 * Robots rules.
 *
 * `/admin` and `/api` are disallowed because there is nothing there for a
 * search engine and a crawler hammering the admin panel wakes the database up
 * for no reason. `/dev` keeps the internal style tile out of results.
 *
 * `/api/media/` is the exception, and it has to be: uploads are served through
 * Payload's own route, so every photo on the site lives under `/api/`. Without
 * this the blanket rule above hides all of them — no Google Images, and
 * nothing for a local result to show a picture of, which for a building people
 * are choosing to live in is most of the point. Both Google and Bing take the
 * most specific matching rule, and `/api/media/` is longer than `/api/`.
 */
export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: ['/', '/api/media/'],
			disallow: ['/admin', '/api/', '/dev/'],
		},
		sitemap: `${siteUrl}/sitemap.xml`,
		host: siteUrl,
	};
}
