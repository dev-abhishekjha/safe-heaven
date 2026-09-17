import 'server-only';

import type { DistanceItem } from '@/components/ui/DistanceList';
import type { IconName } from '@/components/ui/Icon';
import {
	NEARBY,
	NEARBY_LABELS,
	NEARBY_ORDER,
	type PlaceCategory,
} from '@/content/places';
import { RENT_INCLUSIONS, ROOMS, type SeedRoom } from '@/content/rooms';
import {
	getFaqs,
	getFeaturedTestimonials,
	getFounders,
} from '@/repositories/contentRepository';
import { getNearbyPlacesByCategory } from '@/repositories/placeRepository';
import { getRoomTypes } from '@/repositories/propertyRepository';
import {
	getAboutPage,
	getCommunityPage,
	getHomePage,
} from '@/repositories/settingsRepository';
import {
	FOUNDERS,
	type FounderCard,
	STATS,
	type Stat,
	VALUES,
	type Value,
} from '@/screens/About/aboutContent';
import {
	GROUND_RULES,
	type GroundRule,
	type SharedCategory,
	WHAT_GETS_SHARED,
} from '@/screens/Community/communityContent';
import { FAQS, type FaqCategory, type FaqItem } from '@/screens/Faq/faqContent';
import {
	BOOKING_STEPS,
	type BookingStep,
	type HomeTestimonial,
	TRUST_POINTS,
	type TrustPoint,
	type ValuePoint,
	WHY_POINTS,
} from '@/screens/Home/homeContent';
import { debugError } from '@/utils/Logger';

/**
 * The service layer between the pages and the CMS.
 *
 * Two jobs, and the second is the important one.
 *
 * 1. Map CMS rows onto the shapes the components already take, so a component
 *    never learns what Payload's row format looks like.
 *
 * 2. Fall back to the seed content whenever the CMS has nothing to say — an
 *    empty table, a global nobody has saved yet, or the database being
 *    unreachable. Supabase's free tier pauses a project after a week idle, and
 *    "the whole site 500s because nobody enquired for eight days" is a worse
 *    outcome than "the site shows the content it shipped with". Every fallback
 *    is logged, so a silent degradation is still a visible one in the logs.
 *
 * The consequence worth stating plainly: a page renders identically whether
 * the CMS is full, empty or down. That is the point.
 */

/** Run a CMS read, and fall back rather than throw. */
async function withFallback<T>(
	label: string,
	read: () => Promise<T>,
	fallback: T,
): Promise<T> {
	try {
		return await read();
	} catch (error) {
		debugError(`[content] ${label} fell back to seed content:`, error);
		return fallback;
	}
}

const isFilled = (value: unknown): boolean =>
	Array.isArray(value) ? value.length > 0 : Boolean(value);

export type HomeContent = {
	eyebrow: string;
	title: string;
	subtitle: string;
	trustPoints: TrustPoint[];
	whyPoints: ValuePoint[];
	bookingSteps: BookingStep[];
	rooms: SeedRoom[];
	nearby: Record<PlaceCategory, DistanceItem[]>;
	testimonials: HomeTestimonial[];
};

const SEED_HERO = {
	eyebrow: 'Boys-only PG · Greater Noida',
	title: 'A safe, simple place to live while you study.',
	subtitle:
		'Furnished single, double and triple rooms at Mitra Enclave, Sector P7 — a three-minute walk from Knowledge Park II Metro, with campuses, the market and the metro all inside a short ride.',
};

/** The CMS stores occupancy as a number; the site says it in words. */
const OCCUPANCY_WORDS: Record<number, string> = {
	1: 'One person',
	2: 'Two people',
	3: 'Three people',
	4: 'Four people',
};

const occupancyLabel = (count: number) =>
	OCCUPANCY_WORDS[count] ?? `${count} people`;

/** CMS room rows carry no rent on the public side — the field is access-controlled. */
function toSeedRooms(
	rows: Awaited<ReturnType<typeof getRoomTypes>>,
): SeedRoom[] {
	return rows.map((row) => {
		const seed = ROOMS.find((candidate) => candidate.key === row.slug);
		return {
			key: (row.slug as SeedRoom['key']) ?? 'double',
			name: row.name,
			occupancy: occupancyLabel(row.occupancy),
			shortBody: row.summary ?? seed?.shortBody ?? '',
			longBody: row.summary ?? seed?.longBody ?? '',
			inclusions:
				row.furnishings?.map((entry) => entry.item).filter(Boolean) ??
				seed?.inclusions ??
				[],
			bestFor: seed?.bestFor ?? '',
			beds: seed?.beds ?? String(row.occupancy),
			storage: seed?.storage ?? '',
			availability: row.availability,
			availabilityLabel:
				row.availability === 'limited'
					? 'Few left'
					: row.availability === 'unavailable'
						? 'Full'
						: 'Available',
			icon: seed?.icon ?? 'home',
		};
	});
}

function toDistanceGroups(
	grouped: Record<
		PlaceCategory,
		{
			name: string;
			distance: string;
			note?: string | null;
			highlight?: boolean | null;
		}[]
	>,
): Record<PlaceCategory, DistanceItem[]> {
	const out = {} as Record<PlaceCategory, DistanceItem[]>;
	for (const category of NEARBY_ORDER) {
		out[category] = (grouped[category] ?? []).map((place) => ({
			name: place.name,
			distance: place.distance,
			note: place.note ?? undefined,
			highlight: place.highlight ?? undefined,
		}));
	}
	return out;
}

export async function getHomeContent(): Promise<HomeContent> {
	const [page, rooms, nearby, testimonials] = await Promise.all([
		withFallback('home page global', getHomePage, null),
		withFallback('room types', getRoomTypes, []),
		withFallback('nearby places', getNearbyPlacesByCategory, null),
		withFallback('testimonials', () => getFeaturedTestimonials(3), []),
	]);

	return {
		eyebrow: page?.eyebrow || SEED_HERO.eyebrow,
		title: page?.title || SEED_HERO.title,
		subtitle: page?.subtitle || SEED_HERO.subtitle,
		trustPoints: isFilled(page?.trustPoints)
			? (page?.trustPoints ?? []).map((point) => ({
					icon: point.iconKey as IconName,
					lead: point.lead ?? undefined,
					text: point.text,
				}))
			: TRUST_POINTS,
		whyPoints: isFilled(page?.whyPoints)
			? (page?.whyPoints ?? []).map((point) => ({
					icon: point.iconKey as IconName,
					title: point.title,
					body: point.body,
				}))
			: WHY_POINTS,
		// `howItWorks` rows carry no icon — the admin does not ask for one, since
		// the three steps are fixed. Positional fallback to the seed's icons.
		bookingSteps: isFilled(page?.howItWorks)
			? (page?.howItWorks ?? []).map((step, index) => ({
					icon: BOOKING_STEPS[index]?.icon ?? 'check',
					title: step.title,
					body: step.body,
				}))
			: BOOKING_STEPS,
		rooms: rooms.length > 0 ? toSeedRooms(rooms) : ROOMS,
		nearby: nearby ? toDistanceGroups(nearby) : NEARBY,
		testimonials: testimonials.map((row) => ({
			id: String(row.id),
			quote: row.quote,
			name: row.name,
			role: row.context ?? undefined,
		})),
	};
}

export type PropertyContent = {
	rooms: SeedRoom[];
	inclusions: typeof RENT_INCLUSIONS;
};

export async function getPropertyContent(): Promise<PropertyContent> {
	const rooms = await withFallback('room types', getRoomTypes, []);
	return {
		rooms: rooms.length > 0 ? toSeedRooms(rooms) : ROOMS,
		inclusions: RENT_INCLUSIONS,
	};
}

export type CommunityContent = {
	title: string;
	intro: string;
	shared: SharedCategory[];
	groundRules: GroundRule[];
};

export async function getCommunityContent(): Promise<CommunityContent> {
	const page = await withFallback(
		'community page global',
		getCommunityPage,
		null,
	);
	return {
		title: page?.title || 'Where the useful stuff actually gets passed on.',
		intro:
			page?.intro ||
			'Everyone here is a student at one of the colleges nearby, which means someone in the building has already done the internship you are applying for, taken the elective you are unsure about, or sold the cycle you need. The WhatsApp community is where that gets shared instead of lost.',
		shared: isFilled(page?.whatGetsShared)
			? (page?.whatGetsShared ?? []).map((item) => ({
					icon: item.iconKey as IconName,
					title: item.title,
					body: item.body,
				}))
			: WHAT_GETS_SHARED,
		groundRules: isFilled(page?.groundRules)
			? (page?.groundRules ?? []).map((rule) => ({
					title: rule.title,
					body: rule.body,
				}))
			: GROUND_RULES,
	};
}

export type ContactContent = {
	nearby: Record<PlaceCategory, DistanceItem[]>;
	labels: Record<PlaceCategory, string>;
};

export async function getContactContent(): Promise<ContactContent> {
	const nearby = await withFallback(
		'nearby places',
		getNearbyPlacesByCategory,
		null,
	);
	return {
		nearby: nearby ? toDistanceGroups(nearby) : NEARBY,
		labels: NEARBY_LABELS,
	};
}

/**
 * FAQs.
 *
 * A row that came from the CMS is treated as confirmed — someone typed it into
 * the admin panel on purpose. The seed's `confirmed: false` entries only exist
 * while the CMS is empty, which is exactly when the page should still be
 * showing "needs your confirmation".
 */
export async function getFaqContent(): Promise<FaqItem[]> {
	const rows = await withFallback('faqs', getFaqs, []);
	if (rows.length === 0) {
		return FAQS;
	}

	return rows.map((row) => ({
		id: String(row.id),
		category: row.category as FaqCategory,
		question: row.question,
		answer: lexicalToText(row.answer),
		confirmed: true,
	}));
}

type LexicalNode = { text?: string; children?: LexicalNode[] };

/** Flatten a Lexical document to plain paragraphs. The FAQ answers are prose. */
function lexicalToText(doc: unknown): string {
	const root = (doc as { root?: LexicalNode } | null)?.root;
	if (!root) {
		return '';
	}
	const walk = (node: LexicalNode): string =>
		node.text ?? (node.children ?? []).map(walk).join('');
	return (root.children ?? []).map(walk).filter(Boolean).join('\n\n');
}

export type AboutContent = {
	/** Null keeps the loud "not written yet" block visible — see AboutOrigin. */
	story: string | null;
	stats: Stat[];
	values: Value[];
	founders: FounderCard[];
};

/**
 * About.
 *
 * `story` stays null unless someone has actually written it. Everything else on
 * this site falls back to seed content when the CMS is empty; the origin story
 * deliberately does not, because there is no seed to fall back to and inventing
 * one is the exact failure this page is built to avoid.
 */
export async function getAboutContent(): Promise<AboutContent> {
	const [page, founders] = await Promise.all([
		withFallback('about page global', getAboutPage, null),
		withFallback('founders', getFounders, []),
	]);

	return {
		story: page?.intro?.trim() ? page.intro : null,
		stats: isFilled(page?.stats)
			? (page?.stats ?? []).map((stat) => ({
					value: stat.value,
					label: stat.label,
				}))
			: STATS,
		values: isFilled(page?.values)
			? (page?.values ?? []).map((value) => ({
					icon: value.iconKey as IconName,
					title: value.title,
					body: value.body,
				}))
			: VALUES,
		founders:
			founders.length > 0
				? founders.map((founder) => ({
						id: String(founder.id),
						name: founder.name,
						role: founder.role,
						bio: founder.bio,
						linkedinUrl: founder.linkedinUrl ?? undefined,
					}))
				: FOUNDERS,
	};
}
