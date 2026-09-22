import type { IconName } from '@/components/ui/Icon';
import type { MediaImageSource } from '@/components/ui/MediaImage';

/**
 * About page content — PLACEHOLDER SEED.
 *
 * Shaped to match the `about-page` global and the `founders` collection.
 *
 * Two things on this page cannot be drafted and are deliberately empty: the
 * origin story and the founders. Both are statements about real people, and a
 * plausible invention would read as fact. The components render a visibly
 * unfinished state instead, so the gap is impossible to miss in review and
 * impossible to ship by accident.
 */

export type Stat = { value: string; label: string };

/**
 * EMPTY ON PURPOSE — E15.16.
 *
 * "50+ happy residents" on a building that has housed eleven people is the
 * single most common lie on a PG website, and the easiest one to disprove by
 * walking in. The strip hides itself until there are numbers worth printing.
 */
export const STATS: Stat[] = [];

export type FounderCard = {
	id: string;
	name: string;
	role: string;
	bio: string;
	linkedinUrl?: string;
	/** Absent until someone uploads one — the card falls back to a placeholder. */
	photo?: MediaImageSource;
};

/** Empty until you supply names, roles and bios — E15.5. */
export const FOUNDERS: FounderCard[] = [];

export type Value = { icon: IconName; title: string; body: string };

/**
 * Three values.
 *
 * These are not sentiment — each one restates a rule the site already keeps,
 * so a visitor can check them against the rest of the pages. That is the only
 * kind of "our values" section worth having. Still needs your sign-off
 * (E15.16), because they are being published in your name.
 */
export const VALUES: Value[] = [
	{
		icon: 'securityCheck',
		title: 'Safety is not a feature',
		body: 'Boys-only, a warden on site, a gate that gets locked. It is the first thing a parent asks about and the last thing we would economise on.',
	},
	{
		icon: 'inclusive',
		title: 'One number, no surprises',
		body: 'Wi-Fi, power, water and housekeeping are in the rent. No meter readings at the end of the month, and no bill you did not expect.',
	},
	{
		icon: 'phone',
		title: 'You talk to a person',
		body: 'Nothing is paid on this website and nothing is agreed without a conversation. You see the room, you meet whoever runs the place, and then you decide.',
	},
];
