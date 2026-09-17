import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import type { Value } from '@/screens/About/aboutContent';

/**
 * Three values, each of which the rest of the site can be checked against.
 *
 * "Safety is not a feature" is verifiable — the property page says boys-only
 * and describes the gate. "You talk to a person" is verifiable — there is no
 * pay button anywhere. A values section that cannot be checked is decoration;
 * this one is a promise a visitor can audit in two clicks.
 */
export function AboutValues({ values }: { values: Value[] }) {
	return (
		<ul className="grid gap-5 md:grid-cols-3">
			{values.map((value) => (
				<Card as="li" key={value.title} className="flex flex-col gap-4">
					<span className="flex size-11 items-center justify-center rounded-pill bg-accent-tint text-accent">
						<Icon name={value.icon} size={20} aria-hidden />
					</span>
					<h3 className="text-lg font-semibold text-ink">{value.title}</h3>
					<p className="text-sm leading-relaxed text-body">{value.body}</p>
				</Card>
			))}
		</ul>
	);
}
