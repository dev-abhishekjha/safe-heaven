'use client';

import { Icon } from '@/components/ui/Icon';
import { cn } from '@/utils/UtilsClassName';
import * as RadixAccordion from '@radix-ui/react-accordion';
import type { ReactNode } from 'react';

export type AccordionItem = {
	value: string;
	trigger: ReactNode;
	content: ReactNode;
};

type AccordionProps = {
	items: AccordionItem[];
	/** Multiple panels open at once — right for an FAQ someone is scanning. */
	type?: 'single' | 'multiple';
	className?: string;
};

/**
 * The site's one accordion.
 *
 * Built on Radix rather than a `<details>` element or a hand-rolled toggle,
 * because the accessible version of this is more work than it looks: roving
 * focus with the arrow keys, Home and End, `aria-expanded` and
 * `aria-controls` kept in sync, and a trigger that is a real button. Radix
 * does all of it, and every one of those is a thing a hand-rolled version
 * silently gets wrong.
 *
 * Defaults to `multiple`: on an FAQ, opening a second question should not
 * close the first, because people compare answers.
 */
export function Accordion({
	items,
	type = 'multiple',
	className,
}: AccordionProps) {
	const rootProps =
		type === 'single'
			? ({ type: 'single', collapsible: true } as const)
			: ({ type: 'multiple' } as const);

	return (
		<RadixAccordion.Root
			{...rootProps}
			className={cn('flex flex-col', className)}
		>
			{items.map((item) => (
				<RadixAccordion.Item
					key={item.value}
					value={item.value}
					className="border-b border-line-soft"
				>
					<RadixAccordion.Header>
						<RadixAccordion.Trigger className="group flex w-full items-start justify-between gap-6 py-5 text-left transition-colors hover:text-accent">
							<span className="text-base font-semibold text-ink group-hover:text-accent sm:text-[17px]">
								{item.trigger}
							</span>
							<span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-pill bg-surface-alt text-muted transition-transform duration-200 group-data-[state=open]:rotate-180">
								<Icon name="chevronDown" size={16} aria-hidden />
							</span>
						</RadixAccordion.Trigger>
					</RadixAccordion.Header>

					<RadixAccordion.Content className="overflow-hidden">
						<div className="max-w-[68ch] pb-6 text-sm leading-relaxed text-body sm:text-base">
							{item.content}
						</div>
					</RadixAccordion.Content>
				</RadixAccordion.Item>
			))}
		</RadixAccordion.Root>
	);
}
