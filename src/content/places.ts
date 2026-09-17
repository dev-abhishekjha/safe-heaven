import type { DistanceItem } from '@/components/ui/DistanceList';
import { NEAREST_METRO } from '@/utils/SiteConfig';

/**
 * Nearby places — PLACEHOLDER SEED, and the single source for them.
 *
 * Grouped exactly as `getNearbyPlacesByCategory()` returns them, so the home
 * page and Contact Us read one shape and the CMS swap is a change of source,
 * not of markup.
 *
 * Only distances already on record appear here. Hospitals and shopping are
 * EMPTY rather than guessed, and both pages render only the categories that
 * have rows — so an unconfirmed category is absent instead of wrong. The full
 * list is E15.13.
 */

export type PlaceCategory = 'university' | 'metro' | 'hospital' | 'shopping';

export const NEARBY: Record<PlaceCategory, DistanceItem[]> = {
	university: [
		{ name: 'Ram-Eesh Group of Institutions', distance: '1.5 km' },
		{ name: 'Galgotias College of Engineering', distance: '2.5 km' },
	],
	metro: NEAREST_METRO.map((stop, index) => ({
		name: stop.name,
		distance: stop.distance,
		note: index === 0 ? 'About a three-minute walk' : undefined,
		highlight: index === 0,
	})),
	hospital: [], // E15.13
	shopping: [], // E15.13
};

export const NEARBY_LABELS: Record<PlaceCategory, string> = {
	university: 'Colleges and universities',
	metro: 'Metro',
	hospital: 'Hospitals',
	shopping: 'Shopping and daily needs',
};

/** Colleges lead, because that is the search that brings people here. */
export const NEARBY_ORDER: PlaceCategory[] = [
	'university',
	'metro',
	'hospital',
	'shopping',
];
