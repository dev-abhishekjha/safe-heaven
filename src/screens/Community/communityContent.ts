import type { IconName } from '@/components/ui/Icon';

/**
 * Community page content — PLACEHOLDER SEED.
 *
 * Shaped to match the `community-page` global field for field, so swapping to
 * `getCommunityPage()` is a change of source rather than a change of markup.
 * The categories still need confirming with you — E15.15.
 */

export type SharedCategory = { icon: IconName; title: string; body: string };

export const WHAT_GETS_SHARED: SharedCategory[] = [
	{
		icon: 'opportunity',
		title: 'Internships and openings',
		body: 'Someone always hears about a role before it is posted anywhere. Those get dropped in the group first.',
	},
	{
		icon: 'campus',
		title: 'Seniors who have done it already',
		body: 'Which elective is worth it, which professor grades hard, what the interview actually asked. Most of it is a message away.',
	},
	{
		icon: 'shopping',
		title: 'Buying, selling and swapping',
		body: 'Cycles, textbooks, a fridge someone is leaving behind. It changes hands inside the building rather than on the open market.',
	},
	{
		icon: 'community',
		title: 'Notices and everyday logistics',
		body: 'Water supply, a cab share to the station at 6 am, who is ordering food. The small things that are annoying to sort out alone.',
	},
];

export type GroundRule = { title: string; body: string };

/**
 * Three rules, and the reason for each.
 *
 * A group with no rules becomes a group nobody reads, and one with fifteen
 * becomes a group nobody posts in. These are the minimum. They need your
 * confirmation before launch — E15.15.
 */
export const GROUND_RULES: GroundRule[] = [
	{
		title: 'Residents only',
		body: 'The group is for people living here. That is what makes it worth reading and what keeps it safe to post in.',
	},
	{
		title: 'No forwards, no selling from outside',
		body: 'Good-morning images and outside promotions are the fastest way to kill a useful group. They get removed.',
	},
	{
		title: 'Ask properly, answer properly',
		body: 'Real questions get real answers here. It works because people take five extra seconds to write both.',
	},
];

export type CommunityPostCard = {
	id: string;
	title: string;
	/** Rendered as a readable date; ISO in, formatted at the component. */
	date: string;
	excerpt?: string;
};

/**
 * EMPTY ON PURPOSE.
 *
 * These come from the `community-posts` collection. Inventing an event that
 * did not happen is the same mistake as inventing a testimonial — it reads as
 * real and nobody catches it. The section hides itself until there are posts.
 */
export const COMMUNITY_POSTS: CommunityPostCard[] = [];
