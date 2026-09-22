/**
 * Site-wide constants.
 *
 * Build-time defaults. The `siteSettings` global is live and `getSiteSettings`
 * feeds the header, footer and action bar, so staff can change these without a
 * deploy. What stays here is the fallback used when Postgres is unreachable,
 * and the single place to update when the real phone number and email arrive
 * (E15.11 in todo/TODO.md).
 */

export const SITE_NAME = 'Safe Haven';
export const SITE_LEGAL_NAME = 'Safe Heaven Accomodations';

export const CONTACT = {
	phoneDisplay: '+91 82734 58926',
	phoneHref: 'tel:+918273458926',
	email: 'safehaven25482@gmail.com',
	emailHref: 'mailto:safehaven25482@gmail.com',
	visitingHours: '9 am – 8 pm, daily',
} as const;

export const ADDRESS = {
	line1: 'Mitra Enclave, Sector P7',
	line2: 'Near Pari Chowk, Greater Noida',
} as const;

/**
 * Messaging. Named for the role rather than the app, per AGENTS.md — if this
 * ever becomes Telegram or a web chat widget, nothing downstream renames.
 */
export const CHAT = {
	number: '918273458926',
	label: 'WhatsApp',
	url: 'https://wa.me/918273458926',
	/** Pre-fills the first message so the team gets context immediately. */
	urlWithMessage(message: string) {
		return `https://wa.me/918273458926?text=${encodeURIComponent(message)}`;
	},
} as const;

/**
 * The resident WhatsApp community.
 *
 * `inviteUrl` is null until the real group link exists (E15.9), and the join
 * card renders a different, honest state while it is — asking us for the link
 * rather than offering a button that goes nowhere. Moves to `siteSettings`
 * with everything else in this file (E3.11); it must never be hardcoded in a
 * component.
 */
export const COMMUNITY: { inviteUrl: string | null; note: string } = {
	inviteUrl: null,
	note: 'Free, and you can leave any time.',
};

export const NEAREST_METRO = [
	{ name: 'Knowledge Park II', distance: '300 m' },
	{ name: 'Pari Chowk', distance: '1.2 km' },
] as const;

/**
 * Social handles.
 *
 * Empty while none are live (E15.11 covers the accounts). The contact page
 * renders a quiet "coming soon" note rather than a row of dead icons, and the
 * footer already says the same. Moves to `siteSettings` with the rest (E3.11).
 */
export const SOCIALS: { label: string; url: string }[] = [];

/**
 * Map links.
 *
 * Built from the address rather than coordinates, because the exact pin is not
 * confirmed yet. `embedUrl` is the keyless Google embed — no API key, and it
 * is only ever requested after the visitor asks for it.
 */
const MAP_QUERY = encodeURIComponent(
	'Safe Heaven Accomodations, Mitra Enclave, Sector P7, Greater Noida',
);

export const MAP = {
	embedUrl: `https://www.google.com/maps?q=${MAP_QUERY}&output=embed`,
	openUrl: `https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`,
} as const;

export type NavItem = {
	href: string;
	label: string;
};

export const NAV_ITEMS: NavItem[] = [
	{ href: '/', label: 'Home' },
	{ href: '/property', label: 'Property' },
	{ href: '/community', label: 'Community' },
	{ href: '/about', label: 'About Us' },
	{ href: '/faq', label: 'FAQ' },
	{ href: '/contact', label: 'Contact Us' },
];
