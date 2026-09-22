import { cn } from '@/utils/UtilsClassName';
import type { ReactNode } from 'react';

/**
 * Shared control styling. Every text-like input composes this, so focus and
 * error treatment can never drift between the enquiry popup and the contact
 * form. Height clears the 44px touch minimum.
 */
export const CONTROL_CLASSES = cn(
	'w-full min-h-12 rounded-field border border-field-line bg-surface',
	'px-4 py-3 text-sm text-ink placeholder:text-label',
	'transition-colors outline-none',
	'focus:border-accent focus:ring-4 focus:ring-accent/10',
	'disabled:bg-surface-alt disabled:text-label',
);

export const CONTROL_ERROR_CLASSES =
	'border-danger focus:border-danger focus:ring-danger/10';

/** Id the error message is rendered under, so controls can point at it. */
export function errorId(fieldId: string) {
	return `${fieldId}-error`;
}

type FieldProps = {
	label: string;
	/** Must match the control's `id`. */
	htmlFor: string;
	children: ReactNode;
	hint?: string;
	error?: string;
	optional?: boolean;
	className?: string;
};

/**
 * Label, control, and the one place an error message may appear.
 *
 * `optional` marks the exceptions rather than flagging every required field —
 * on a lead-capture form nearly everything is required, so marking the few
 * optional ones reads shorter and less like a form to be endured.
 *
 * Controls pass `error` themselves (which sets the red border and
 * `aria-invalid`) and `aria-describedby={errorId(id)}` when in an error state.
 */
export function Field({
	label,
	htmlFor,
	children,
	hint,
	error,
	optional,
	className,
}: FieldProps) {
	return (
		<div className={cn('flex flex-col gap-2', className)}>
			<label
				htmlFor={htmlFor}
				className="text-[13px] font-semibold text-ink-soft"
			>
				{label}
				{optional ? (
					<span className="ml-1 font-normal text-label">(optional)</span>
				) : null}
			</label>

			{children}

			{error ? (
				<p id={errorId(htmlFor)} className="text-xs text-danger-ink">
					{error}
				</p>
			) : hint ? (
				<p className="text-xs text-muted">{hint}</p>
			) : null}
		</div>
	);
}
