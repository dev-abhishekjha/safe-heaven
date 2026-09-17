import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { HomeTestimonial } from '@/screens/Home/homeContent';

type HomeTestimonialsProps = {
	items: HomeTestimonial[];
};

/**
 * Resident quotes.
 *
 * Returns `null` when there is nothing published, and the home page simply has
 * one section fewer. That is the correct behaviour rather than a fallback: a
 * placeholder quote is indistinguishable from a real one at a glance, which is
 * exactly how invented testimonials survive to launch. Real quotes are
 * collected under E15.7.
 */
export function HomeTestimonials({ items }: HomeTestimonialsProps) {
	if (items.length === 0) {
		return null;
	}

	return (
		<Container className="flex flex-col gap-10 py-16 lg:py-20">
			<SectionHeading
				eyebrow="Residents"
				title="What the people living here say."
			/>

			<ul className="grid gap-5 md:grid-cols-3 lg:gap-6">
				{items.map((item) => (
					<Card as="li" key={item.id} className="flex flex-col gap-5">
						<blockquote className="flex-1 text-base leading-relaxed text-ink-soft">
							&ldquo;{item.quote}&rdquo;
						</blockquote>
						<footer className="flex flex-col gap-0.5 border-t border-line-soft pt-4">
							<span className="text-sm font-semibold text-ink">
								{item.name}
							</span>
							{item.role ? (
								<span className="text-xs text-muted">{item.role}</span>
							) : null}
						</footer>
					</Card>
				))}
			</ul>
		</Container>
	);
}
