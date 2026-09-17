import { Container } from '@/components/ui/Container';
import type { Stat } from '@/screens/About/aboutContent';

type AboutStatsProps = {
	stats: Stat[];
};

/**
 * Numbers, if there are any.
 *
 * Hidden entirely when the list is empty, and that is the feature. A new
 * building has small numbers, and a small true number beats a large invented
 * one — but no number at all beats both, because an empty stats strip is the
 * thing that tempts someone to fill it in. So there is nothing to fill.
 */
export function AboutStats({ stats }: AboutStatsProps) {
	if (stats.length === 0) {
		return null;
	}

	return (
		<section className="border-y border-line bg-surface-alt">
			<Container className="grid gap-8 py-10 sm:grid-cols-3 lg:py-12">
				{stats.map((stat) => (
					<div key={stat.label} className="flex flex-col gap-1.5">
						<span className="font-display text-4xl font-semibold text-ink">
							{stat.value}
						</span>
						<span className="text-sm text-body">{stat.label}</span>
					</div>
				))}
			</Container>
		</section>
	);
}
