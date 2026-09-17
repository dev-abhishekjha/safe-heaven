import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Compose Tailwind classes. `clsx` handles conditionals, `twMerge` resolves
 * conflicts so a caller's `className` always wins over a component default:
 *
 *   cn('px-4 bg-action', isGhost && 'bg-transparent', className)
 *
 * Use this everywhere instead of template-string concatenation — string
 * concatenation silently keeps both `px-4` and `px-6` and the later one in the
 * stylesheet wins, which is not the one you wrote.
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
