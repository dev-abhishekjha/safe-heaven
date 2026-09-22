import type { IconName } from '@/components/ui/Icon';
import type { MediaImageSource } from '@/components/ui/MediaImage';
import type { SeedRoom } from '@/content/rooms';

/**
 * Property page content — PLACEHOLDER SEED.
 *
 * Room facts are NOT restated here; they come from `src/content/rooms.ts`.
 * This module holds only what is specific to this page: the gallery, the
 * house rules, and the shape of the comparison table.
 */

export type GalleryItem = {
	id: string;
	/** What the photo will show. Becomes the alt text when the real one lands. */
	label: string;
	/** Spans two columns on desktop — used for the wide shots. */
	wide?: boolean;
	/** The real photo, once one is uploaded against the property record. */
	photo?: MediaImageSource;
};

/**
 * Placeholders, in the order a visitor would walk the building.
 *
 * Eight of them, one spanning two columns, which is nine cells in a
 * three-column grid — the grid fills exactly, with no orphan tile on the last
 * row. Real photos are E15.2 / E15.3 / E15.4, and that list is where these
 * eight subjects come from.
 */
export const GALLERY: GalleryItem[] = [
	{ id: 'exterior', label: 'Building exterior', wide: true },
	{ id: 'single', label: 'Single room' },
	{ id: 'double', label: 'Double sharing room' },
	{ id: 'triple', label: 'Triple sharing room' },
	{ id: 'common', label: 'Common room' },
	{ id: 'study', label: 'Study room' },
	{ id: 'kitchen', label: 'Shared kitchen' },
	{ id: 'terrace', label: 'Terrace' },
];

export type HouseRule = { icon: IconName; title: string; body: string };

/**
 * House rules.
 *
 * Every line here is DRAFTED and must be confirmed before launch (E15.14).
 * Publishing a rule the building does not actually enforce is worse than
 * publishing none: it is the first thing a resident will quote back.
 */
export const HOUSE_RULES: HouseRule[] = [
	{
		icon: 'security',
		title: 'Boys only',
		body: 'Safe Haven is a boys-only PG. This one is not a house rule so much as what the building is.',
	},
	{
		icon: 'clock',
		title: 'Gate hours',
		body: 'The main gate is locked overnight. Tell the warden in advance if you are going to be late and it is not a problem.', // E15.14
	},
	{
		icon: 'community',
		title: 'Guests',
		body: 'Visitors are welcome in the common areas during the day. Overnight guests need to be cleared first.', // E15.14
	},
	{
		icon: 'housekeeping',
		title: 'Your room, your responsibility',
		body: 'Common areas are cleaned for you. Rooms are yours to keep in order.', // E15.14
	},
];

export type ComparisonRow = {
	label: string;
	value: (room: SeedRoom) => string;
};

/**
 * The comparison, defined once as accessors over the room seed.
 *
 * The desktop table and the stacked mobile cards both read this array, so
 * there is no version of the page where the two show different rows in a
 * different order — which is the usual failure mode when a responsive table is
 * built as two separate markup blocks.
 *
 * There is deliberately no rent row.
 */
export const COMPARISON_ROWS: ComparisonRow[] = [
	{ label: 'Occupancy', value: (room) => room.occupancy },
	{ label: 'Beds', value: (room) => room.beds },
	{ label: 'Storage', value: (room) => room.storage },
	{ label: 'Best for', value: (room) => room.bestFor },
	{ label: 'Rent', value: () => 'Shared on enquiry' },
];
