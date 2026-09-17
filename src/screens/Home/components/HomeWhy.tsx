import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { ValuePoint } from '@/screens/Home/homeContent';

/**
 * Four reasons, no more.
 *
 * Every PG website in Greater Noida lists fifteen amenities in a grid of tiny
 * icons, which reads as noise. Four claims with a sentence each are harder to
 * write and much easier to believe.
 */
export function HomeWhy({ points }: { points: ValuePoint[] }) {
	return (
		<Container className="flex flex-col gap-10 py-16 lg:py-20">
			<SectionHeading
				eyebrow="Why Safe Haven"
				title="The things that actually matter when you live somewhere."
				description="Not a list of amenities — the four things residents and their parents ask about before anything else."
			/>

			<ul className="grid gap-5 sm:grid-cols-2 lg:gap-6">
				{points.map((point) => (
					<Card as="li" key={point.title} className="flex flex-col gap-4">
						<span className="flex size-11 items-center justify-center rounded-pill bg-accent-tint text-accent">
							<Icon name={point.icon} size={21} aria-hidden />
						</span>
						<h3 className="text-lg font-semibold text-ink">{point.title}</h3>
						<p className="text-sm leading-relaxed text-body">{point.body}</p>
					</Card>
				))}
			</ul>
		</Container>
	);
}
