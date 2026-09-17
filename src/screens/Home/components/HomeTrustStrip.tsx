import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import type { TrustPoint } from '@/screens/Home/homeContent';

/**
 * Three facts, directly under the hero.
 *
 * These are the ones that decide whether a parent keeps reading: how far the
 * metro is, whether the building is watched, and whether the rent is the whole
 * cost. A full-bleed tinted band rather than cards, so it reads as one answer
 * rather than three competing claims.
 */
export function HomeTrustStrip({ points }: { points: TrustPoint[] }) {
	return (
		<section className="border-y border-line bg-surface-alt">
			<Container className="grid gap-6 py-8 sm:grid-cols-3 sm:gap-8 sm:py-9">
				{points.map((point) => (
					<div key={point.text} className="flex items-start gap-3">
						<Icon
							name={point.icon}
							size={20}
							className="mt-0.5 shrink-0 text-accent"
							aria-hidden
						/>
						<p className="text-sm leading-relaxed text-ink-soft">
							{point.lead ? (
								<strong className="font-semibold text-ink">
									{point.lead}{' '}
								</strong>
							) : null}
							{point.text}
						</p>
					</div>
				))}
			</Container>
		</section>
	);
}
