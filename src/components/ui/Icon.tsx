import { cn } from '@/utils/UtilsClassName';
import type { ReactNode } from 'react';

/**
 * Hand-drawn icon set — stroke 1.5 on a 24px grid, inheriting `currentColor`.
 *
 * Drawn rather than pulled from a library so the weight matches the design
 * exactly and the bundle carries only the glyphs this site uses. Names describe
 * the ROLE on this site, not the picture, so a swap never means a rename.
 */
const PATHS = {
	home: (
		<>
			<path d="M3 10.5 12 3l9 7.5" />
			<path d="M5 9.5V20h14V9.5" />
			<path d="M10 20v-5h4v5" />
		</>
	),
	security: <path d="M12 3 5 6v6c0 4.4 3 8.2 7 9 4-.8 7-4.6 7-9V6l-7-3Z" />,
	securityCheck: (
		<>
			<path d="M12 3 5 6v6c0 4.4 3 8.2 7 9 4-.8 7-4.6 7-9V6l-7-3Z" />
			<path d="m9.5 12 1.8 1.8L15 10" />
		</>
	),
	metro: (
		<>
			<rect x="6" y="3" width="12" height="14" rx="3" />
			<path d="M6 12h12" />
			<path d="m8 17-2 4" />
			<path d="m16 17 2 4" />
		</>
	),
	pin: (
		<>
			<path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" />
			<circle cx="12" cy="10" r="2.5" />
		</>
	),
	campus: (
		<>
			<path d="M12 3 2.5 7.5 12 12l9.5-4.5L12 3Z" />
			<path d="M5 10.5V16c0 1.6 3.1 3 7 3s7-1.4 7-3v-5.5" />
		</>
	),
	hospital: (
		<>
			<rect x="3.5" y="3.5" width="17" height="17" rx="4" />
			<path d="M12 7v10" />
			<path d="M7 12h10" />
		</>
	),
	shopping: (
		<>
			<path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8Z" />
			<path d="M9 8V6a3 3 0 0 1 6 0v2" />
		</>
	),
	wifi: (
		<>
			<path d="M2.5 9a14 14 0 0 1 19 0" />
			<path d="M5.5 12.5a9.5 9.5 0 0 1 13 0" />
			<path d="M8.5 16a5 5 0 0 1 7 0" />
			<circle cx="12" cy="19.2" r="1" />
		</>
	),
	power: <path d="M13 3 5.5 13.5H11L10 21l7.5-10.5H12L13 3Z" />,
	water: <path d="M12 3s6 6.3 6 10.2A6 6 0 0 1 6 13.2C6 9.3 12 3 12 3Z" />,
	housekeeping: (
		<>
			<path d="M4 20h16" />
			<path d="M6.5 20V9.5l5-4.5 6 5V20" />
			<path d="M10 20v-4h4v4" />
		</>
	),
	inclusive: (
		<>
			<path d="M4 7h16v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7Z" />
			<path d="M4 11h16" />
			<path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
		</>
	),
	community: (
		<>
			<circle cx="9" cy="8" r="3" />
			<path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
			<path d="M16 6.5a3 3 0 0 1 0 5.6" />
			<path d="M17.5 20a5.5 5.5 0 0 0-2-4.2" />
		</>
	),
	opportunity: (
		<>
			<path d="M4 7.5h16v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-12Z" />
			<path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5" />
			<path d="M4 12h16" />
		</>
	),
	chat: <path d="M3.5 20.5 5 16.3A8.2 8.2 0 1 1 8 19.2l-4.5 1.3Z" />,
	phone: (
		<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1.1 1A16 16 0 0 1 4 5.1 1 1 0 0 1 5 4Z" />
	),
	mail: (
		<>
			<rect x="3" y="5.5" width="18" height="13" rx="2.5" />
			<path d="m3.5 7 8.5 6 8.5-6" />
		</>
	),
	clock: (
		<>
			<circle cx="12" cy="12" r="8.5" />
			<path d="M12 7.5V12l3 2" />
		</>
	),
	calendar: (
		<>
			<rect x="3.5" y="5" width="17" height="15" rx="3" />
			<path d="M3.5 10h17" />
			<path d="M8 3v4" />
			<path d="M16 3v4" />
		</>
	),
	check: <path d="m5 12.5 4.5 4.5L19 7" />,
	arrowRight: (
		<>
			<path d="M5 12h14" />
			<path d="m13 6 6 6-6 6" />
		</>
	),
	chevronDown: <path d="m6 9.5 6 6 6-6" />,
	close: (
		<>
			<path d="m6 6 12 12" />
			<path d="M18 6 6 18" />
		</>
	),
	menu: (
		<>
			<path d="M4 8h16" />
			<path d="M4 16h16" />
		</>
	),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof PATHS;

type IconProps = {
	name: IconName;
	size?: number;
	className?: string;
	/**
	 * Icons are decorative by default and hidden from screen readers. Pass a
	 * label only when the icon is the sole content of a control — and prefer
	 * labelling the control itself.
	 */
	label?: string;
	/**
	 * Declared because call sites pass it, and TypeScript does not type-check
	 * JSX attributes containing a hyphen — so an `aria-hidden` on a component
	 * that does not declare it is accepted and then silently dropped. The
	 * default below is already `true` for an unlabelled icon, so passing it
	 * changes nothing; not declaring it made ~15 call sites look like they
	 * were doing accessibility work that never reached the DOM.
	 */
	'aria-hidden'?: boolean;
};

export function Icon({
	name,
	size = 24,
	className,
	label,
	'aria-hidden': ariaHidden,
}: IconProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.5}
			strokeLinecap="round"
			strokeLinejoin="round"
			className={cn('shrink-0', className)}
			role={label ? 'img' : undefined}
			aria-label={label}
			aria-hidden={ariaHidden ?? (label ? undefined : true)}
		>
			{PATHS[name]}
		</svg>
	);
}
