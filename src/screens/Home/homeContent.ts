import type { IconName } from '@/components/ui/Icon';
export { NEARBY, NEARBY_LABELS } from '@/content/places';

/**
 * Home page content — PLACEHOLDER SEED.
 *
 * Every string here moves to the `home-page` global and to the `room-types` /
 * `nearby-places` collections once Postgres connects (E3, E15). Keeping it in
 * one module means that swap is one import change per section rather than a
 * hunt through nine components, and it keeps the section components purely
 * presentational so they can be handed real CMS rows unchanged.
 *
 * Anything marked E15.1 is DRAFTED copy that has not been confirmed with the
 * owner. Anything marked E15.13 is a fact we do not have yet. Grep `E15` before
 * launch — nothing carrying that marker may ship.
 */

export type TrustPoint = { icon: IconName; lead?: string; text: string };

export const TRUST_POINTS: TrustPoint[] = [
	{ icon: 'pin', lead: '300 m', text: 'to Knowledge Park II Metro' },
	{
		icon: 'securityCheck',
		lead: '24×7',
		text: 'CCTV, warden and secure entry', // E15.1
	},
	{
		icon: 'inclusive',
		text: 'Wi-Fi, power, water and housekeeping included in the rent', // E15.1
	},
];

export type ValuePoint = { icon: IconName; title: string; body: string };

export const WHY_POINTS: ValuePoint[] = [
	{
		icon: 'securityCheck',
		title: 'Secure by default',
		// E15.1 — confirm what is actually in place before this goes live.
		body: 'CCTV on the entrance and common areas, a warden on site, and a gate that is not left standing open at night.',
	},
	{
		icon: 'inclusive',
		title: 'One rent, nothing extra',
		// E15.1
		body: 'Wi-Fi, electricity, water and housekeeping are part of the rent. No meter readings, no separate bills at the end of the month.',
	},
	{
		icon: 'campus',
		title: 'Close to campus',
		body: 'The metro is a three-minute walk and the nearest colleges are a short ride, so getting to a 9 am class does not start at 7.',
	},
	{
		icon: 'community',
		title: 'People, not just rooms',
		body: 'Residents are students from the colleges around here. Shared kitchen, common room, and a WhatsApp group that actually gets used.',
	},
];

export type BookingStep = { icon: IconName; title: string; body: string };

/**
 * The booking explainer exists to answer the question every parent asks first:
 * what do I have to pay, and to whom. The answer on this site is always
 * "nothing here" — step three says so in plain words.
 */
export const BOOKING_STEPS: BookingStep[] = [
	{
		icon: 'mail',
		title: 'Send an enquiry',
		body: 'Your name, a phone number, and roughly when you want to move in. It takes a minute.',
	},
	{
		icon: 'phone',
		title: 'We call you back',
		body: 'We answer your questions, tell you what is free right now, and fix a time to visit if you want one.',
	},
	{
		icon: 'chat',
		title: 'Confirm over chat or in person',
		body: 'Paperwork and payment happen with a person, on WhatsApp or at the building. Nothing is ever paid on this website.',
	},
];

export type CommunityHighlight = { icon: IconName; text: string };

export const COMMUNITY_HIGHLIGHTS: CommunityHighlight[] = [
	{ icon: 'community', text: 'A resident WhatsApp group for notices and help' },
	{ icon: 'home', text: 'Shared kitchen and common room' }, // E15.1
	{ icon: 'opportunity', text: 'Study groups and festival evenings' }, // E15.1
];

export type HomeTestimonial = {
	id: string;
	quote: string;
	name: string;
	/** Their college, or their year — whatever identifies them honestly. */
	role?: string;
};

/**
 * EMPTY ON PURPOSE.
 *
 * Testimonials are the one kind of content that must never be drafted for
 * review, because a plausible-looking fake quote is exactly the thing that
 * survives to launch unnoticed. The section hides itself while this is empty;
 * real quotes are collected under E15.7.
 */
export const TESTIMONIALS: HomeTestimonial[] = [];
