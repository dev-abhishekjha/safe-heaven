import {
	CONTROL_CLASSES,
	CONTROL_ERROR_CLASSES,
	errorId,
} from '@/components/ui/Field';
import { cn } from '@/utils/UtilsClassName';
import type { InputHTMLAttributes } from 'react';

type MonthPickerProps = InputHTMLAttributes<HTMLInputElement> & {
	error?: boolean;
};

/** First selectable month is the current one — nobody moves in last March. */
function currentMonth() {
	const now = new Date();
	return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Move-in date, at month granularity.
 *
 * A native `<input type="month">` rather than a date-picker library: students
 * planning a move know the month, not the day, and asking for an exact date
 * adds a decision they cannot make yet. It also costs no JavaScript and opens
 * the platform month wheel on a phone, which beats any custom calendar.
 */
export function MonthPicker({
	className,
	error,
	id,
	min,
	...props
}: MonthPickerProps) {
	return (
		<input
			id={id}
			type="month"
			min={min ?? currentMonth()}
			aria-invalid={error || undefined}
			aria-describedby={error && id ? errorId(id) : undefined}
			className={cn(CONTROL_CLASSES, error && CONTROL_ERROR_CLASSES, className)}
			{...props}
		/>
	);
}
