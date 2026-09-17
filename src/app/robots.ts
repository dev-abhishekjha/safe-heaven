import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000';

/**
 * Robots rules.
 *
 * `/admin` and `/api` are disallowed because there is nothing there for a
 * search engine and a crawler hammering the admin panel wakes the database up
 * for no reason. `/dev` keeps the internal style tile out of results.
 */
export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: ['/admin', '/api/', '/dev/'],
		},
		sitemap: `${siteUrl}/sitemap.xml`,
		host: siteUrl,
	};
}
