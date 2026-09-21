import type { IconName } from '@/components/ui/Icon';

/**
 * The icons an editor may choose, for every field in the CMS that asks for one.
 *
 * There used to be two hand-maintained lists — one on `amenities`, one shared
 * by the page globals — and they had quietly drifted apart. The page list was
 * missing `shopping`, which the community page's own content uses, so seeding
 * that content failed validation with "The following field is invalid" and no
 * indication of which value was wrong. This list is the union of the two, so
 * that cannot happen again by omission.
 *
 * `satisfies readonly IconName[]` is the other half: a name that is not in the
 * icon set fails the build rather than the seed, and an icon renamed in
 * `Icon.tsx` breaks here immediately. The import is type-only, so no JSX is
 * pulled into the CMS config.
 *
 * Deliberately NOT the whole `IconName` union: `arrowRight`, `chevronDown`,
 * `close` and `menu` are interface chrome and have no business in a content
 * dropdown.
 */
export const CONTENT_ICON_NAMES = [
	'check',
	'security',
	'securityCheck',
	'metro',
	'pin',
	'campus',
	'hospital',
	'shopping',
	'wifi',
	'power',
	'water',
	'housekeeping',
	'inclusive',
	'community',
	'opportunity',
	'chat',
	'clock',
] as const satisfies readonly IconName[];

export const iconOptions = (): { label: string; value: string }[] =>
	CONTENT_ICON_NAMES.map((value) => ({ label: value, value }));
