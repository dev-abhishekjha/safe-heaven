import { Badge } from '@/components/ui/Badge';
import { Panel } from '@/components/ui/Panel';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';

type AboutOriginProps = {
	story: string | null;
};

/**
 * Why this building exists.
 *
 * The single highest-value piece of copy on the site: it is the only thing
 * here that no competitor can copy, and it is what a parent reads to decide
 * whether they are dealing with a business or a person.
 *
 * Which is exactly why it is not drafted. An invented origin story reads as
 * true, gets approved because it sounds fine, and then someone repeats it back
 * on a phone call to a founder who has never heard it. Until the real words
 * exist this renders a state that cannot be mistaken for finished — see
 * E15.6.
 */
export function AboutOrigin({ story }: AboutOriginProps) {
	if (!story) {
		return (
			<Panel
				tone="tint"
				className="flex flex-col items-start gap-4 border border-dashed border-warn"
			>
				<Badge tone="placeholder">Not written yet</Badge>
				<h2 className="font-display text-2xl font-semibold text-ink">
					The origin story goes here
				</h2>
				<p className="max-w-[60ch] text-base leading-relaxed text-body">
					Three or four sentences in your own words: what you were doing before,
					what you saw that made you start this, and what you decided the place
					would never do. Nobody else can write this, and nothing else on the
					site does as much work.
				</p>
				<p className="text-sm text-muted">
					Tracked as E15.6 in docs/TASKS.md. This block is deliberately loud —
					it must not reach launch.
				</p>
			</Panel>
		);
	}

	return (
		<div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
			<div className="flex flex-col gap-5">
				{story.split('\n\n').map((paragraph) => (
					<p
						key={paragraph.slice(0, 40)}
						className="max-w-[52ch] text-base leading-relaxed text-body sm:text-[17px]"
					>
						{paragraph}
					</p>
				))}
			</div>
			<PlaceholderImage
				label="Photo — the building, early on"
				className="h-64 rounded-panel sm:h-80"
			/>
		</div>
	);
}
