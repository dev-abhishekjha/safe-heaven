import { cn } from '@/utils/UtilsClassName';

export type DistanceItem = {
	name: string;
	distance: string;
	/** A short qualifier, e.g. "About a three-minute walk". */
	note?: string;
	/** Draws the distance in the action colour — for the standout entries. */
	highlight?: boolean;
};

type DistanceListProps = {
	items: DistanceItem[];
	className?: string;
};

/**
 * Name-and-distance rows, used on the home page and Contact Us.
 *
 * This is the site's strongest asset rendered as plainly as possible: eight
 * campuses, a metro stop at 300m and a hospital at 500m answer the question a
 * parent is actually asking. A description list is the correct element — each
 * place is a term and its distance is the description.
 */
export function DistanceList({ items, className }: DistanceListProps) {
	return (
		<dl className={cn('flex flex-col', className)}>
			{items.map((item, index) => (
				<div
					key={item.name}
					className={cn(
						'flex items-baseline justify-between gap-4 py-2.5',
						index < items.length - 1 && 'border-b border-line-soft',
					)}
				>
					<dt className="flex flex-col gap-0.5">
						<span className="text-sm text-ink-soft">{item.name}</span>
						{item.note ? (
							<span className="text-xs text-muted">{item.note}</span>
						) : null}
					</dt>
					<dd
						className={cn(
							'shrink-0 text-sm font-semibold',
							item.highlight ? 'text-action' : 'text-ink',
						)}
					>
						{item.distance}
					</dd>
				</div>
			))}
		</dl>
	);
}
