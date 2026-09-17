import { Card } from '@/components/ui/Card';
import { DistanceList } from '@/components/ui/DistanceList';
import type { DistanceItem } from '@/components/ui/DistanceList';
import { Icon, type IconName } from '@/components/ui/Icon';
import {
	NEARBY_LABELS,
	NEARBY_ORDER,
	type PlaceCategory,
} from '@/content/places';

const CATEGORY_ICONS: Record<PlaceCategory, IconName> = {
	university: 'campus',
	metro: 'metro',
	hospital: 'hospital',
	shopping: 'shopping',
};

/**
 * What is nearby, in full.
 *
 * The home page shows the same data as a teaser; this is the complete set.
 * Categories with no confirmed rows do not render — see `src/content/places.ts`
 * and E15.13. When the CMS is live this takes
 * `getNearbyPlacesByCategory()` unchanged, because it already reads that shape.
 */
export function ContactDistances({
	nearby,
}: {
	nearby: Record<PlaceCategory, DistanceItem[]>;
}) {
	const categories = NEARBY_ORDER.filter(
		(category) => nearby[category].length > 0,
	);

	return (
		<ul className="grid gap-5 sm:grid-cols-2">
			{categories.map((category) => (
				<Card as="li" key={category} className="flex flex-col gap-4">
					<div className="flex items-center gap-2.5">
						<Icon
							name={CATEGORY_ICONS[category]}
							size={18}
							className="text-accent"
							aria-hidden
						/>
						<h3 className="text-sm font-semibold text-ink">
							{NEARBY_LABELS[category]}
						</h3>
					</div>
					<DistanceList items={nearby[category]} />
				</Card>
			))}
		</ul>
	);
}
