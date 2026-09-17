import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import type { Inclusion } from '@/content/rooms';

/**
 * What the rent covers, directly under the intro.
 *
 * Placed before the rooms on purpose: the difference between the three rooms
 * is easier to judge once you know the five things that do not change between
 * them. Every claim here is drafted and carries E15.1 in the seed.
 */
export function PropertyInclusions({ items }: { items: Inclusion[] }) {
	return (
		<section className="border-y border-line bg-surface-alt">
			<Container className="flex flex-col gap-6 py-10 lg:py-12">
				<h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-label">
					Included in every rent
				</h2>

				<ul className="grid gap-6 sm:grid-cols-3 lg:grid-cols-5">
					{items.map((item) => (
						<li key={item.label} className="flex flex-col gap-2">
							<span className="flex size-10 items-center justify-center rounded-pill bg-surface text-accent">
								<Icon name={item.icon} size={19} aria-hidden />
							</span>
							<span className="text-sm font-semibold text-ink">
								{item.label}
							</span>
							<span className="text-xs leading-relaxed text-muted">
								{item.detail}
							</span>
						</li>
					))}
				</ul>
			</Container>
		</section>
	);
}
