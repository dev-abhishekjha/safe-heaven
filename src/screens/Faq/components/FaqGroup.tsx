import { Accordion } from '@/components/ui/Accordion';
import { Badge } from '@/components/ui/Badge';
import type { FaqItem } from '@/screens/Faq/faqContent';

type FaqGroupProps = {
	label: string;
	items: FaqItem[];
};

/**
 * One category of questions.
 *
 * Unconfirmed answers do not silently render as if they were checked: they
 * carry a loud badge, and where I had nothing to go on the answer is empty and
 * says so. An FAQ is the page a resident quotes back at you six months later,
 * so a plausible guess here is more expensive than a visible gap.
 */
export function FaqGroup({ label, items }: FaqGroupProps) {
	return (
		<section className="flex flex-col gap-2">
			<h2 className="text-xs uppercase tracking-[0.1em] text-label">{label}</h2>
			<Accordion
				items={items.map((item) => ({
					value: item.id,
					trigger: item.question,
					content: <FaqAnswer item={item} />,
				}))}
			/>
		</section>
	);
}

function FaqAnswer({ item }: { item: FaqItem }) {
	if (item.confirmed) {
		return <p>{item.answer}</p>;
	}

	return (
		<div className="flex flex-col items-start gap-3">
			<Badge tone="placeholder">Needs your confirmation</Badge>
			{item.answer ? (
				<p>{item.answer}</p>
			) : (
				<p className="text-muted">
					No answer yet — this one depends on how you actually run the building.
				</p>
			)}
			<p className="text-xs text-muted">
				Tracked as E15.8. Not published to search engines while it is
				unconfirmed.
			</p>
		</div>
	);
}
