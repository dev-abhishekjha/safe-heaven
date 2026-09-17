import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import type { SharedCategory } from '@/screens/Community/communityContent';

/**
 * What actually circulates in the group.
 *
 * Concrete categories rather than "a vibrant community": someone deciding
 * whether to live here wants to know what they would get out of it, and
 * "internships get posted here before they are advertised" answers that where
 * an adjective does not.
 */
export function CommunityShared({ items }: { items: SharedCategory[] }) {
	return (
		<ul className="grid gap-5 sm:grid-cols-2">
			{items.map((category) => (
				<Card as="li" key={category.title} className="flex flex-col gap-4">
					<span className="flex size-11 items-center justify-center rounded-pill bg-accent-tint text-accent">
						<Icon name={category.icon} size={20} aria-hidden />
					</span>
					<h3 className="text-lg font-semibold text-ink">{category.title}</h3>
					<p className="text-sm leading-relaxed text-body">{category.body}</p>
				</Card>
			))}
		</ul>
	);
}
