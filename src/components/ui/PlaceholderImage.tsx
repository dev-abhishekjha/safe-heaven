import { cn } from '@/utils/UtilsClassName';

type PlaceholderImageProps = {
	/** What the real photo will be — shown in the box. */
	label: string;
	className?: string;
	tone?: 'neutral' | 'map';
};

/**
 * A marked stand-in for a photo we do not have yet.
 *
 * Deliberately dashed and labelled rather than a grey block or a stock image:
 * a missing photo has to be obvious at a glance during review, and impossible
 * to mistake for finished work at launch. Tracked under E15 in todo/TODO.md.
 */
export function PlaceholderImage({
	label,
	className,
	tone = 'neutral',
}: PlaceholderImageProps) {
	return (
		<div
			className={cn(
				'flex items-center justify-center rounded-card border border-dashed p-4',
				tone === 'map'
					? 'border-accent-line bg-accent-tint-strong text-accent'
					: 'border-slate-300 bg-surface-sunken text-label',
				className,
			)}
		>
			<span className="text-center text-[11px] font-semibold uppercase tracking-[0.18em]">
				{label}
			</span>
		</div>
	);
}
