import {
	CONTROL_CLASSES,
	CONTROL_ERROR_CLASSES,
	errorId,
} from '@/components/ui/Field';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/utils/UtilsClassName';
import type {
	InputHTMLAttributes,
	SelectHTMLAttributes,
	TextareaHTMLAttributes,
} from 'react';

type WithError = { error?: boolean };

export function Input({
	className,
	error,
	id,
	...props
}: InputHTMLAttributes<HTMLInputElement> & WithError) {
	return (
		<input
			id={id}
			aria-invalid={error || undefined}
			aria-describedby={error && id ? errorId(id) : undefined}
			className={cn(CONTROL_CLASSES, error && CONTROL_ERROR_CLASSES, className)}
			{...props}
		/>
	);
}

export function Textarea({
	className,
	error,
	id,
	rows = 4,
	...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & WithError) {
	return (
		<textarea
			id={id}
			rows={rows}
			aria-invalid={error || undefined}
			aria-describedby={error && id ? errorId(id) : undefined}
			className={cn(
				CONTROL_CLASSES,
				'resize-y leading-relaxed',
				error && CONTROL_ERROR_CLASSES,
				className,
			)}
			{...props}
		/>
	);
}

export function Select({
	className,
	error,
	id,
	children,
	...props
}: SelectHTMLAttributes<HTMLSelectElement> & WithError) {
	return (
		<div className="relative">
			<select
				id={id}
				aria-invalid={error || undefined}
				aria-describedby={error && id ? errorId(id) : undefined}
				className={cn(
					CONTROL_CLASSES,
					// Room for the chevron; the native arrow is removed.
					'appearance-none pr-11',
					error && CONTROL_ERROR_CLASSES,
					className,
				)}
				{...props}
			>
				{children}
			</select>
			<Icon
				name="chevronDown"
				size={18}
				className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-label"
			/>
		</div>
	);
}

/**
 * Indian mobile number entry. The +91 prefix is rendered as static text rather
 * than sitting in the value, so what gets stored is always ten clean digits and
 * a student typing "+91 98765..." cannot double it up.
 */
export function PhoneInput({
	className,
	error,
	id,
	...props
}: InputHTMLAttributes<HTMLInputElement> & WithError) {
	return (
		<div
			className={cn(
				CONTROL_CLASSES,
				'flex items-center gap-2 py-0 pl-4 pr-0',
				'focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/10',
				error && CONTROL_ERROR_CLASSES,
				className,
			)}
		>
			<span className="select-none text-sm text-muted">+91</span>
			<input
				id={id}
				type="tel"
				inputMode="numeric"
				autoComplete="tel-national"
				maxLength={10}
				pattern="[0-9]{10}"
				placeholder="98765 43210"
				aria-invalid={error || undefined}
				aria-describedby={error && id ? errorId(id) : undefined}
				className="min-h-12 w-full bg-transparent text-sm text-ink outline-none placeholder:text-label"
				{...props}
			/>
		</div>
	);
}
