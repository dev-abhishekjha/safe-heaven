'use client';

import { type ReactNode, useEffect, useRef } from 'react';

/**
 * Fades and lifts its children into place the first time they are scrolled to.
 *
 * Visible-by-default is the contract, and it matters more than the animation.
 * The element ships from the server with no `data-reveal` attribute, so the CSS
 * that hides it cannot match: a crawler, a reader mode, or a browser whose
 * JavaScript never arrived all get the finished page. Only after this component
 * has mounted — proof that JavaScript is running and can therefore also unhide
 * it — does it mark itself hidden. Hiding in the markup and hoping the script
 * turns up fails blankly and silently, which is the worse trade on a page whose
 * whole job is to be read.
 *
 * Marking hidden after paint would normally cost a visible flash. It does not
 * here, because anything already on screen is left alone entirely: it has
 * arrived, so there is nothing to animate. Only sections still below the fold
 * are hidden, and by definition nobody is looking at those yet.
 *
 * The observer disconnects after firing. This is an entrance, not a scroll
 * effect — a section that re-hides when you scroll back up is one you cannot
 * re-read.
 */
export function Reveal({
	children,
	className,
	/** Nudges later items in a group, so a row arrives as a sequence. */
	delayMs = 0,
}: {
	children: ReactNode;
	className?: string;
	delayMs?: number;
}) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const node = ref.current;

		if (!node) {
			return;
		}

		// Someone who asked for less motion gets none of this — not a faster
		// version of it, and never the hidden starting state.
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			return;
		}

		// Already on screen: leave it exactly as the server rendered it.
		if (node.getBoundingClientRect().top < window.innerHeight * 0.9) {
			return;
		}

		node.dataset.reveal = 'hidden';
		node.style.transitionDelay = delayMs ? `${delayMs}ms` : '';

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						node.dataset.reveal = 'shown';
						observer.disconnect();
					}
				}
			},
			// Fires a little before the section is truly on screen, so the
			// movement is finishing as it arrives rather than starting then.
			{ rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
		);

		observer.observe(node);

		return () => observer.disconnect();
	}, [delayMs]);

	return (
		<div ref={ref} className={className}>
			{children}
		</div>
	);
}
