import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000';

/**
 * Robots rules.
 *
 * `/admin` and `/api` are disallowed because there is nothing there for a
 * search engine and a crawler hammering the admin panel wakes the database up
 * for no reason. `/dev` keeps the internal style tile out of results.
 *
 * Photos are not under `/api/` any more, so they need no exception here. They
 * used to be — uploads were served through Payload's `/api/media/file` route,
 * and `/api/media/` had to be allowed or the blanket rule hid every photo from
 * Google Images. They now come from the storage bucket's public URL via
 * `/_next/image` (see src/payload/storageConfig.ts), which `/` already allows.
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
