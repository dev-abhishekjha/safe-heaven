import { cn } from '@/utils/UtilsClassName';
import type { ReactNode } from 'react';

type BadgeTone = 'available' | 'limited' | 'unavailable' | 'placeholder';

type BadgeProps = {
	children: ReactNode;
	tone?: BadgeTone;
	className?: string;
};

/**
 * Tones are named for what they MEAN, not what they look like, so a room's
 * availability maps straight from CMS data without a colour lookup at the
 * call site.
 *
 * `placeholder` is the odd one out: it marks content that is not real yet
 * (draft testimonials, proposed copy) and must never survive to launch. It is
 * deliberately loud.
 */
const TONES: Record<BadgeTone, string> = {
	available: 'bg-ok-tint text-ok',
	limited: 'bg-action-tint text-action-ink',
	unavailable: 'bg-surface-sunken text-muted',
	placeholder: 'bg-warn-tint text-warn',
};

export function Badge({ children, tone = 'available', className }: BadgeProps) {
	return (
		<span
			className={cn(
				'inline-flex items-center rounded-pill px-3 py-1.5',
				'text-[11px] font-semibold uppercase tracking-[0.1em]',
				TONES[tone],
				className,
			)}
		>
			{children}
		</span>
	);
}
