import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000';

/**
 * Sitemap.
 *
 * A fixed list because the site is a fixed set of pages — there are no
 * per-property URLs to enumerate while there is one building. When a second
 * property arrives this reads room and property slugs from the repositories.
 *
 * Priorities are relative, not absolute: the home page and the two pages that
 * answer "where is it" and "what does it cost" carry the weight, because those
 * are the searches that bring a student here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
	const lastModified = new Date();

	return [
		{ url: siteUrl, lastModified, changeFrequency: 'weekly', priority: 1 },
		{
			url: `${siteUrl}/property`,
			lastModified,
			changeFrequency: 'weekly',
			priority: 0.9,
		},
		{
			url: `${siteUrl}/contact`,
			lastModified,
			changeFrequency: 'monthly',
			priority: 0.9,
		},
		{
			url: `${siteUrl}/community`,
			lastModified,
			changeFrequency: 'monthly',
			priority: 0.7,
		},
		{
			url: `${siteUrl}/faq`,
			lastModified,
			changeFrequency: 'monthly',
			priority: 0.7,
		},
		{
			url: `${siteUrl}/about`,
			lastModified,
			changeFrequency: 'yearly',
			priority: 0.6,
		},
	];
}
