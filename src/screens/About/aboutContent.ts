import type { IconName } from '@/components/ui/Icon';
import type { MediaImageSource } from '@/components/ui/MediaImage';

/**
 * About page content — PLACEHOLDER SEED.
 *
 * Shaped to match the `about-page` global and the `founders` collection.
 *
 * `FOUNDERS` stays deliberately empty: it is a statement about real people,
 * and a plausible invention would read as fact. The component renders a
 * visibly unfinished state instead, so the gap is impossible to miss.
 *
 * `STORY_DRAFT` is the one exception, added on request so the page reads
 * whole. It is DRAFT COPY WRITTEN BY AN ASSISTANT, not by the owner — see the
 * note on it before this ships.
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

/**
 * Origin story — DRAFT. Replace before launch (E15.6).
 *
 * Written to fill the page, not to be true. It deliberately makes no factual
 * claim that could be wrong — no dates, no numbers, no prior jobs, no names —
 * and only restates commitments the rest of the site already makes, so it
 * cannot contradict another page. That is the most a draft can safely do.
 *
 * It is still words in your voice on your About page. Edit it in the CMS
 * (`about-page` → intro), which overrides this, and the real version replaces
 * it everywhere at once.
 */
export const STORY_DRAFT = `Safe Haven started from something we kept watching happen. A student moves to Greater Noida for a course, takes a room sight unseen over a phone call, and finds out afterwards what the rent actually includes — and who to call when the water stops.

We wanted to run the opposite of that. One building, looked after by the people who own it, with the number said plainly before anyone agrees to anything. A gate that genuinely gets locked at night, because that is the first thing a parent asks about and the last thing worth economising on.

Everything here follows from that. Nothing is paid on this website. You speak to a person before you commit, you see the room before you move in, and the person who answers the phone is the person responsible for the answer.`;

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
