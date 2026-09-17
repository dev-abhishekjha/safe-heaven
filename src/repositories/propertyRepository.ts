import 'server-only';

import type { Amenity, Property, RoomType } from '@/payload-types';
import { getPayloadClient } from '@/repositories/payloadClient';
import { cache } from 'react';

/**
 * Reads for the building and its rooms.
 *
 * Every function is wrapped in `cache()` so a page that needs the property in
 * three sections queries once. Depth 1 resolves uploads and relationships to
 * objects; deeper than that pulls relations we never render.
 */

/**
 * The property.
 *
 * There is one row, so this takes the first rather than requiring a slug —
 * callers stay simple, and the day a second building exists this is the single
 * function to change.
 */
export const getProperty = cache(async (): Promise<Property | null> => {
	const payload = await getPayloadClient();
	const { docs } = await payload.find({
		collection: 'properties',
		limit: 1,
		depth: 1,
	});
	return docs[0] ?? null;
});

/** Room types in display order — the site never shows them unordered. */
export const getRoomTypes = cache(async (): Promise<RoomType[]> => {
	const payload = await getPayloadClient();
	const { docs } = await payload.find({
		collection: 'room-types',
		sort: 'displayOrder',
		limit: 20,
		depth: 1,
	});
	return docs;
});

export const getRoomTypeBySlug = cache(
	async (slug: string): Promise<RoomType | null> => {
		const payload = await getPayloadClient();
		const { docs } = await payload.find({
			collection: 'room-types',
			where: { slug: { equals: slug } },
			limit: 1,
			depth: 1,
		});
		return docs[0] ?? null;
	},
);

export const getAmenities = cache(async (): Promise<Amenity[]> => {
	const payload = await getPayloadClient();
	const { docs } = await payload.find({
		collection: 'amenities',
		sort: 'displayOrder',
		limit: 100,
	});
	return docs;
});
