import { cn } from '@/utils/UtilsClassName';
import type { ReactNode } from 'react';

type ContainerProps = {
	children: ReactNode;
	className?: string;
	/** `narrow` caps the measure for long-form copy so lines stay readable. */
	width?: 'default' | 'narrow';
	as?: 'div' | 'section' | 'header' | 'footer' | 'nav' | 'main';
};

/**
 * The one horizontal rhythm for the whole site.
 *
 * 79rem outer cap minus the 2rem side padding lands content at 1200px on
 * desktop — the measurement the design canvas is drawn to — while keeping a
 * 20px gutter on a phone. Nothing else should set page-level side padding.
 */
export function Container({
	children,
	className,
	width = 'default',
	as: Tag = 'div',
}: ContainerProps) {
	return (
		<Tag
			className={cn(
				'mx-auto w-full px-5 sm:px-8',
				width === 'default' ? 'max-w-[79rem]' : 'max-w-[48rem]',
				className,
			)}
		>
			{children}
		</Tag>
	);
}
