import type { GroundRule } from '@/screens/Community/communityContent';

/**
 * Ground rules, numbered.
 *
 * An ordered list rather than cards: three short rules read faster in a column
 * than spread across a grid, and the numbering makes it obvious that this is
 * the whole list rather than a sample.
 */
export function CommunityGroundRules({ rules }: { rules: GroundRule[] }) {
	return (
		<ol className="flex flex-col gap-6">
			{rules.map((rule, index) => (
				<li
					key={rule.title}
					className="flex gap-5 border-t border-line-soft pt-6 first:border-0 first:pt-0"
				>
					<span className="flex size-9 shrink-0 items-center justify-center rounded-pill bg-surface-alt text-sm font-semibold text-ink-soft">
						{index + 1}
					</span>
					<div className="flex flex-col gap-1.5">
						<h3 className="text-base font-semibold text-ink">{rule.title}</h3>
						<p className="max-w-[60ch] text-sm leading-relaxed text-body">
							{rule.body}
						</p>
					</div>
				</li>
			))}
		</ol>
	);
}
