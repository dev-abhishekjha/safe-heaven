import { cn } from '@/utils/UtilsClassName';
import type { ReactNode } from 'react';

type EyebrowProps = {
	children: ReactNode;
	className?: string;
};

/** The small uppercase label above a section title. */
export function Eyebrow({ children, className }: EyebrowProps) {
	return (
		<span className={cn('block text-eyebrow uppercase text-accent', className)}>
			{children}
		</span>
	);
}

type SectionHeadingProps = {
	title: ReactNode;
	eyebrow?: ReactNode;
	description?: ReactNode;
	/** h1 for the one page title, h2 everywhere else. */
	as?: 'h1' | 'h2';
	/** Optional trailing element — a link or button aligned to the baseline. */
	action?: ReactNode;
	className?: string;
};

/**
 * Every section opens the same way: eyebrow, display title, optional
 * supporting line. Keeping it in one component is what stops eight sections
 * drifting into eight slightly different heading treatments.
 */
export function SectionHeading({
	title,
	eyebrow,
	description,
	as: Tag = 'h2',
	action,
	className,
}: SectionHeadingProps) {
	return (
		<div
			className={cn(
				'flex flex-col gap-6 md:flex-row md:items-end md:justify-between',
				className,
			)}
		>
			<div className="flex max-w-[40rem] flex-col gap-4">
				{eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
				<Tag
					className={cn(
						'font-display font-semibold text-balance text-ink',
						Tag === 'h1'
							? 'text-4xl sm:text-display'
							: 'text-3xl sm:text-section',
					)}
				>
					{title}
				</Tag>
				{description ? (
					<p className="text-base leading-relaxed text-body">{description}</p>
				) : null}
			</div>
			{action ? <div className="shrink-0">{action}</div> : null}
		</div>
	);
}
