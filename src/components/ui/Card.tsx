import { cn } from '@/utils/UtilsClassName';
import type { ReactNode } from 'react';

type CardProps = {
	children: ReactNode;
	className?: string;
	/** Adds the standard inner padding. Turn off for cards that open with an image. */
	padded?: boolean;
	as?: 'div' | 'article' | 'li';
};

/**
 * The default content surface: white, hairline border, 18px radius.
 * For larger feature surfaces with a tint or a dark ground, use `Panel`.
 */
export function Card({
	children,
	className,
	padded = true,
	as: Tag = 'div',
}: CardProps) {
	return (
		<Tag
			className={cn(
				'overflow-hidden rounded-card border border-line bg-surface',
				padded && 'p-6 sm:p-7',
				className,
			)}
		>
			{children}
		</Tag>
	);
}
