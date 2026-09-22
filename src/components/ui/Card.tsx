import { cn } from '@/utils/UtilsClassName';
import type { ReactNode } from 'react';

type CardProps = {
	children: ReactNode;
	className?: string;
	/** Adds the standard inner padding. Turn off for cards that open with an image. */
	padded?: boolean;
	as?: 'div' | 'article' | 'li';
	/**
	 * Lifts on hover. On by default: every card on this site is a marketing
	 * surface rather than a control, so the lift reads as the page responding
	 * to you, not as a promise that the whole card is clickable.
	 *
	 * Turn it off for a card that sits still — a comparison row, a table-like
	 * panel — where movement would just be noise.
	 */
	lift?: boolean;
};

/**
 * The default content surface: white, hairline border, 18px radius.
 * For larger feature surfaces with a tint or a dark ground, use `Panel`.
 *
 * The hover treatment is a 4px rise, a deeper shadow and a faintly blue edge.
 * It is driven by `transform` and `box-shadow` only — both composited, so the
 * browser never re-lays-out the page mid-hover — and it is suppressed wholesale
 * under `prefers-reduced-motion` by the global rule in globals.css.
 */
export function Card({
	children,
	className,
	padded = true,
	as: Tag = 'div',
	lift = true,
}: CardProps) {
	return (
		<Tag
			className={cn(
				'overflow-hidden rounded-card border border-line bg-surface',
				lift && [
					'transition-[transform,box-shadow,border-color] duration-200 ease-out',
					'hover:-translate-y-1 hover:border-accent-line hover:shadow-card',
				],
				padded && 'p-6 sm:p-7',
				className,
			)}
		>
			{children}
		</Tag>
	);
}
