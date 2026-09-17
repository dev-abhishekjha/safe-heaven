import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { DistanceList } from '@/components/ui/DistanceList';
import type { DistanceItem } from '@/components/ui/DistanceList';
import { Icon, type IconName } from '@/components/ui/Icon';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { SectionHeading } from '@/components/ui/SectionHeading';
import {
	NEARBY_LABELS,
	NEARBY_ORDER,
	type PlaceCategory,
} from '@/content/places';
import { ADDRESS } from '@/utils/SiteConfig';
import Link from 'next/link';

const CATEGORY_ICONS: Record<PlaceCategory, IconName> = {
	university: 'campus',
	metro: 'metro',
	hospital: 'hospital',
	shopping: 'shopping',
};

/**
 * Where it is.
 *
 * Categories with no rows are not rendered at all. That is deliberate: an
 * unconfirmed distance is worse than an absent one, so a category stays out of
 * the page until someone has actually measured it (E15.13). The same shape
 * `getNearbyPlacesByCategory` returns feeds straight in when the CMS is live.
 */
export function HomeLocation({
	nearby,
}: {
	nearby: Record<PlaceCategory, DistanceItem[]>;
}) {
	const categories = NEARBY_ORDER.filter(
		(category) => nearby[category].length > 0,
	);

	return (
		<Container className="flex flex-col gap-10 py-16 lg:py-20">
			<SectionHeading
				eyebrow="Location"
				title="Everything you need is a short walk or a short ride."
				description={`${ADDRESS.line1}, ${ADDRESS.line2}.`}
				action={
					<Button asChild variant="secondary">
						<Link href="/contact">
							Directions and contact
							<Icon name="arrowRight" size={16} />
						</Link>
					</Button>
				}
			/>

			<div className="grid gap-6 lg:grid-cols-5">
				<PlaceholderImage
					tone="map"
					label={`Map — ${ADDRESS.line1}`}
					className="h-64 rounded-panel lg:col-span-3 lg:h-full lg:min-h-[22rem]"
				/>

				<div className="flex flex-col gap-5 lg:col-span-2">
					{categories.map((category) => (
						<Card key={category} className="flex flex-col gap-4">
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
				</div>
			</div>
		</Container>
	);
}
