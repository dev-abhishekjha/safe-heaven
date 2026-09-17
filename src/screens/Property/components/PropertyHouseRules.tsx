import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { HOUSE_RULES } from '@/screens/Property/propertyContent';

/**
 * House rules.
 *
 * Worth saying plainly rather than burying in a PDF a resident signs on the
 * day they arrive: a rule that surprises someone in week two is a complaint,
 * and the same rule published here is just information. Every line is drafted
 * and must be confirmed — E15.14.
 */
export function PropertyHouseRules() {
	return (
		<ul className="grid gap-5 sm:grid-cols-2">
			{HOUSE_RULES.map((rule) => (
				<Card as="li" key={rule.title} className="flex gap-4">
					<span className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-surface-alt text-accent">
						<Icon name={rule.icon} size={18} aria-hidden />
					</span>
					<div className="flex flex-col gap-1.5">
						<h3 className="text-base font-semibold text-ink">{rule.title}</h3>
						<p className="text-sm leading-relaxed text-body">{rule.body}</p>
					</div>
				</Card>
			))}
		</ul>
	);
}
