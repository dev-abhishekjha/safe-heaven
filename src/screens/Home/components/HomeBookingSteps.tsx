import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { BookingStep } from '@/screens/Home/homeContent';

/**
 * How booking works.
 *
 * This section exists to answer one unasked question: is this a site that is
 * going to ask me for money? The answer is no, and step three says so in
 * plain words rather than leaving the visitor to infer it from the absence of
 * a pay button. Removing this section would be a product change, not a design
 * one — see AGENTS.md.
 */
export function HomeBookingSteps({ steps }: { steps: BookingStep[] }) {
	return (
		<section className="bg-surface-alt">
			<Container className="flex flex-col gap-10 py-16 lg:py-20">
				<SectionHeading
					eyebrow="How it works"
					title="Three steps, and none of them are online payments."
					description="You will always speak to a person before anything is agreed."
				/>

				<ol className="grid gap-6 md:grid-cols-3 lg:gap-8">
					{steps.map((step, index) => (
						<li key={step.title} className="flex flex-col gap-4">
							<div className="flex items-center gap-3">
								<span className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-action-tint text-sm font-semibold text-action-ink">
									{index + 1}
								</span>
								<span className="h-px flex-1 bg-line" aria-hidden />
								<Icon
									name={step.icon}
									size={19}
									className="shrink-0 text-accent"
									aria-hidden
								/>
							</div>
							<h3 className="text-lg font-semibold text-ink">{step.title}</h3>
							<p className="text-sm leading-relaxed text-body">{step.body}</p>
						</li>
					))}
				</ol>
			</Container>
		</section>
	);
}
