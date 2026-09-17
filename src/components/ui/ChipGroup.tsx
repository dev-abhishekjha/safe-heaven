'use client';

import { cn } from '@/utils/UtilsClassName';

export type ChipOption = {
	value: string;
	label: string;
};

type ChipGroupProps = {
	options: ChipOption[];
	value: string | null;
	onChange: (value: string) => void;
	/** Announced to screen readers — the question the chips answer. */
	label: string;
	name?: string;
	className?: string;
};

/**
 * A single-select row of pills — used for room type on the enquiry form.
 *
 * Built on native radio inputs rather than buttons so arrow keys move between
 * options, the browser handles the roving tab stop, and the value posts with
 * the form even without JavaScript. The inputs are visually hidden, not
 * `display: none`, which would take them out of the tab order entirely.
 */
export function ChipGroup({
	options,
	value,
	onChange,
	label,
	name = 'chip-group',
	className,
}: ChipGroupProps) {
	return (
		<fieldset className={cn('flex flex-col gap-2', className)}>
			<legend className="sr-only">{label}</legend>
			<div className="flex flex-wrap gap-2">
				{options.map((option) => {
					const selected = option.value === value;
					return (
						<label
							key={option.value}
							className={cn(
								'flex min-h-11 flex-1 cursor-pointer items-center justify-center',
								'rounded-pill border px-4 text-center text-[13px] transition-colors',
								'has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-accent/20',
								selected
									? 'border-action bg-action-tint font-semibold text-action-ink'
									: 'border-line font-medium text-body hover:border-slate-300',
							)}
						>
							<input
								type="radio"
								name={name}
								value={option.value}
								checked={selected}
								onChange={() => onChange(option.value)}
								className="sr-only"
							/>
							{option.label}
						</label>
					);
				})}
			</div>
		</fieldset>
	);
}
