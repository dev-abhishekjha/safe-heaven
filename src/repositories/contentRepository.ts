import 'server-only';

import type { CommunityPost, Faq, Founder, Testimonial } from '@/payload-types';
import { getPayloadClient } from '@/repositories/payloadClient';
import { cache } from 'react';

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
	const payload = await getPayloadClient();
	const { docs } = await payload.find({
		collection: 'testimonials',
		sort: 'displayOrder',
		limit: 50,
		depth: 1,
	});
	return docs;
});

/**
 * Home-page quotes.
 *
 * Returns an empty array when nothing is featured, and the home page hides the
 * whole section — better an absent section than three empty quote cards. Real
 * quotes are tracked as E15.7.
 */
export const getFeaturedTestimonials = cache(
	async (limit = 3): Promise<Testimonial[]> => {
		const payload = await getPayloadClient();
		const { docs } = await payload.find({
			collection: 'testimonials',
			where: { featured: { equals: true } },
			sort: 'displayOrder',
			limit,
			depth: 1,
		});
		return docs;
	},
);

export const getFaqs = cache(async (): Promise<Faq[]> => {
	const payload = await getPayloadClient();
	const { docs } = await payload.find({
		collection: 'faqs',
		sort: 'displayOrder',
		limit: 100,
	});
	return docs;
});

/** FAQs grouped by category, preserving each category's display order. */
export const getFaqsByCategory = cache(
	async (): Promise<Map<Faq['category'], Faq[]>> => {
		const faqs = await getFaqs();
		const grouped = new Map<Faq['category'], Faq[]>();

		for (const faq of faqs) {
			const existing = grouped.get(faq.category);
			if (existing) {
				existing.push(faq);
			} else {
				grouped.set(faq.category, [faq]);
			}
		}

		return grouped;
	},
);

export const getCommunityPosts = cache(
	async (limit = 12): Promise<CommunityPost[]> => {
		const payload = await getPayloadClient();
		const { docs } = await payload.find({
			collection: 'community-posts',
			sort: '-date',
			limit,
			depth: 1,
		});
		return docs;
	},
);

export const getFounders = cache(async (): Promise<Founder[]> => {
	const payload = await getPayloadClient();
	const { docs } = await payload.find({
		collection: 'founders',
		sort: 'displayOrder',
		limit: 20,
		depth: 1,
	});
	return docs;
});
