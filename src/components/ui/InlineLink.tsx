import { cn } from '@/utils/UtilsClassName';
import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * A link inside a sentence.
 *
 * Underlined, not just coloured: colour alone is not a link affordance, and on
 * a page this text-heavy an unmarked accent word reads as emphasis rather than
 * as something to click.
 *
 * It exists mainly so contextual links look the same everywhere. Anchor text is
 * the strongest on-page signal a search engine gets about what the destination
 * is for, so these carry a description of the target page — "single, double and
 * triple sharing rooms" — rather than "click here" or "see more".
 */
export function InlineLink({
	href,
	children,
	className,
}: {
	href: string;
	children: ReactNode;
	className?: string;
}) {
	return (
		<Link
			href={href}
			className={cn(
				'font-semibold text-accent underline decoration-accent-line decoration-2 underline-offset-4',
				'transition-colors hover:text-accent-hover hover:decoration-accent',
				className,
			)}
		>
			{children}
		</Link>
	);
}
