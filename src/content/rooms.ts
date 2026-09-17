import type { IconName } from '@/components/ui/Icon';

/**
 * The rooms — PLACEHOLDER SEED, and the single source for them.
 *
 * Home shows the short version, the property page the long one, and the
 * comparison table is derived from these same objects. That is the point of
 * the module: three surfaces that disagree about how many beds a double has
 * is exactly the kind of drift that survives review, and it cannot happen if
 * there is only one object to read.
 *
 * Replaced wholesale by `getRoomTypes()` once Postgres connects (E3, E15.12).
 * Lines marked E15.1 are drafted copy that has not been confirmed.
 */

/** Mirrors `EnquiryPrefill['roomType']`, declared here so server modules never
 * import from a Client Component. */
export type RoomKey = 'single' | 'double' | 'triple';

export type SeedRoom = {
	key: RoomKey;
	name: string;
	occupancy: string;
	/** One line, for cards. */
	shortBody: string;
	/** Two or three sentences, for the property page. */
	longBody: string;
	/** What is in the room. Drives the card list and the comparison table. */
	inclusions: string[];
	/** Who it suits — the honest version, including the trade-off. */
	bestFor: string;
	beds: string;
	storage: string;
	availability: 'available' | 'limited' | 'unavailable';
	availabilityLabel: string;
	/** Icon used when the room is shown as a block rather than a card. */
	icon: IconName;
};

export const ROOMS: SeedRoom[] = [
	{
		key: 'single',
		name: 'Single room',
		occupancy: 'One person',
		shortBody:
			'Your own room and your own door. The quietest option, and the one that goes first.',
		longBody:
			'A room to yourself, with a door you close. If you study late, keep odd hours, or simply do not want to negotiate the lights with anyone, this is the one. It is also the first to fill each term, so it is worth asking early.',
		inclusions: ['Bed and mattress', 'Study desk and chair', 'Wardrobe'], // E15.1
		bestFor: 'Quiet, privacy, and control over your own hours',
		beds: 'One',
		storage: 'One wardrobe',
		availability: 'limited',
		availabilityLabel: 'Few left',
		icon: 'home',
	},
	{
		key: 'double',
		name: 'Double sharing',
		occupancy: 'Two people',
		shortBody:
			'Two beds, two desks, one room. The middle ground most residents pick.',
		longBody:
			'Two beds and two desks in one room, so you have company without living in a crowd. This is what most residents choose, and it is usually the easiest to arrange at short notice.',
		inclusions: [
			'Two beds and mattresses',
			'Two study desks',
			'Shared wardrobe',
		], // E15.1
		bestFor: 'Company without a crowd, at a lower rent than a single',
		beds: 'Two',
		storage: 'Shared wardrobe',
		availability: 'available',
		availabilityLabel: 'Available',
		icon: 'community',
	},
	{
		key: 'triple',
		name: 'Triple sharing',
		occupancy: 'Three people',
		shortBody:
			'The most economical room, and the easiest way to land somewhere you already know people.',
		longBody:
			'Three beds, three desks, and the lowest rent of the three. It is the practical choice in a first year, and the simplest way to move in with people you already know.',
		inclusions: [
			'Three beds and mattresses',
			'Three study desks',
			'Storage for each',
		], // E15.1
		bestFor: 'The lowest rent, and moving in with people you already know',
		beds: 'Three',
		storage: 'Storage for each',
		availability: 'available',
		availabilityLabel: 'Available',
		icon: 'campus',
	},
];

export const getRoom = (key: RoomKey): SeedRoom => {
	const room = ROOMS.find((candidate) => candidate.key === key);
	if (!room) {
		throw new Error(`Unknown room key: ${key}`);
	}
	return room;
};

export type Inclusion = { icon: IconName; label: string; detail: string };

/**
 * What every rent covers, regardless of room.
 *
 * Stated once, here, because it appears on the home page, the property page
 * and in the answer to the question the enquiry form exists to prompt. All of
 * it is drafted and needs confirming — E15.1.
 */
export const RENT_INCLUSIONS: Inclusion[] = [
	{
		icon: 'wifi',
		label: 'Wi-Fi',
		detail: 'Shared connection throughout the building',
	},
	{ icon: 'power', label: 'Electricity', detail: 'No separate meter reading' },
	{ icon: 'water', label: 'Water', detail: 'Drinking and running water' },
	{
		icon: 'housekeeping',
		label: 'Housekeeping',
		detail: 'Common areas cleaned regularly',
	},
	{ icon: 'security', label: 'Security', detail: 'CCTV and a warden on site' },
];
