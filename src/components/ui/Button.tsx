import { cn } from '@/utils/UtilsClassName';
import { Slot } from '@radix-ui/react-slot';
import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'chat' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: ButtonVariant;
	size?: ButtonSize;
	/** Render as the single child element — use for links that look like buttons. */
	asChild?: boolean;
};

/**
 * `primary` is the only variant that uses the action colour, and a page should
 * carry one primary action repeated, not three competing ones. `chat` is the
 * WhatsApp path and is deliberately a separate variant rather than a colour
 * override, so it can never be mistaken for a second primary.
 */
const VARIANTS: Record<ButtonVariant, string> = {
	primary: 'bg-action text-white shadow-sm hover:bg-action-hover',
	secondary:
		'border border-slate-300 bg-surface text-ink hover:border-slate-400 hover:bg-surface-alt',
	tertiary: 'bg-action-tint text-action-ink hover:bg-action-tint-strong',
	chat: 'bg-chat text-white hover:bg-chat-hover',
	ghost: 'text-ink hover:bg-surface-alt',
};

/** Every size clears the 44px minimum touch target from AGENTS.md. */
const SIZES: Record<ButtonSize, string> = {
	sm: 'min-h-11 gap-2 px-5 text-sm',
	md: 'min-h-12 gap-2 px-6 text-sm',
	lg: 'min-h-13 gap-2.5 px-7 text-[15px]',
};

export function Button({
	variant = 'primary',
	size = 'md',
	asChild = false,
	className,
	type,
	...props
}: ButtonProps) {
	const Comp = asChild ? Slot : 'button';

	return (
		<Comp
			// An implicit submit inside a form is almost never what is wanted.
			type={asChild ? undefined : (type ?? 'button')}
			className={cn(
				'inline-flex items-center justify-center rounded-pill font-semibold',
				'transition-colors duration-150',
				'disabled:pointer-events-none disabled:bg-line disabled:text-label disabled:shadow-none',
				VARIANTS[variant],
				SIZES[size],
				className,
			)}
			{...props}
		/>
	);
}
