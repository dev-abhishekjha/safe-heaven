import 'server-only';

import type { NearbyPlace } from '@/payload-types';
import { getPayloadClient } from '@/repositories/payloadClient';
import { cache } from 'react';

export type PlaceCategory = NearbyPlace['category'];

/** Every nearby place, nearest first within each category. */
export const getNearbyPlaces = cache(async (): Promise<NearbyPlace[]> => {
	const payload = await getPayloadClient();
	const { docs } = await payload.find({
		collection: 'nearby-places',
		sort: 'displayOrder',
		limit: 200,
	});
	return docs;
});

/**
 * The same rows, keyed by category.
 *
 * Grouping here rather than in each page means one query feeds the home page's
 * four blocks and the contact page's four blocks, and the grouping logic
 * cannot drift between them.
 */
export const getNearbyPlacesByCategory = cache(
	async (): Promise<Record<PlaceCategory, NearbyPlace[]>> => {
		const places = await getNearbyPlaces();

		const grouped: Record<PlaceCategory, NearbyPlace[]> = {
			university: [],
			metro: [],
			hospital: [],
			shopping: [],
		};

		for (const place of places) {
			grouped[place.category].push(place);
		}

		return grouped;
	},
);
