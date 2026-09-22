'use client';

import { submitEnquiryAction } from '@/app/(frontend)/actions';
import type { EnquiryPrefill } from '@/components/enquiry/EnquiryProvider';
import { SubmitError } from '@/components/enquiry/SubmitError';
import { Button } from '@/components/ui/Button';
import { ChipGroup } from '@/components/ui/ChipGroup';
import { Field } from '@/components/ui/Field';
import { Icon } from '@/components/ui/Icon';
import { Input, PhoneInput, Textarea } from '@/components/ui/Input';
import { MonthPicker } from '@/components/ui/MonthPicker';
import { chatHrefForRoom } from '@/utils/ChatMessage';
import { CHAT } from '@/utils/SiteConfig';
import {
	type EnquiryInput,
	ROOM_TYPE_OPTIONS,
	enquirySchema,
} from '@/utils/UtilsValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

type EnquiryFormProps = {
	prefill?: EnquiryPrefill;
	onSuccess: (
		name: string,
		phone: string,
		roomType?: EnquiryInput['roomType'],
	) => void;
};

export function EnquiryForm({ prefill, onSuccess }: EnquiryFormProps) {
	const pathname = usePathname();
	const [formError, setFormError] = useState<string | null>(null);
	// Separate from `formError`: a rejected submission is not worth retrying,
	// a dropped connection is. Only the second one gets a Try again button.
	const [canRetry, setCanRetry] = useState(false);

	const {
		register,
		handleSubmit,
		control,
		getValues,
		formState: { errors, isSubmitting },
	} = useForm<EnquiryInput>({
		resolver: zodResolver(enquirySchema),
		defaultValues: {
			fullName: '',
			phone: '',
			email: '',
			// "Not sure" by default so nobody stalls on a decision they have not made.
			roomType: prefill?.roomType ?? 'unsure',
			moveInMonth: '',
			message: '',
			company: '',
		},
	});

	/**
	 * Mirrored in plain state rather than read through `watch`.
	 *
	 * Someone picks a room and then reaches for WhatsApp instead, so the chat
	 * link has to keep up — but `watch` is a subscription the React Compiler
	 * cannot reason about, and adding it made `react-hooks/incompatible-library`
	 * fire and the compiler skip this component. A `useState` updated beside
	 * `field.onChange` costs one line and keeps the form compilable.
	 */
	const [chosenRoom, setChosenRoom] = useState<EnquiryInput['roomType']>(
		prefill?.roomType ?? 'unsure',
	);

	const onSubmit = handleSubmit(async (values) => {
		setFormError(null);
		setCanRetry(false);

		try {
			const result = await submitEnquiryAction({
				...values,
				source: prefill?.source ?? pathname,
			});

			if (result.ok) {
				onSuccess(values.fullName, values.phone, values.roomType);
				return;
			}

			setFormError(result.error);
		} catch {
			// A server action rejects when the request never completes. Left
			// uncaught this becomes an unhandled rejection and the visitor sees
			// nothing at all — the button just stops looking busy.
			setFormError(
				'We could not reach our server just now — that is usually the connection rather than anything you did. Nothing you typed has been lost.',
			);
			setCanRetry(true);
		}
	});

	return (
		<form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
			{/* Honeypot — off-screen, not display:none, and never announced. */}
			<input
				{...register('company')}
				type="text"
				tabIndex={-1}
				autoComplete="off"
				aria-hidden="true"
				className="absolute left-[-9999px] size-px opacity-0"
			/>

			<Field
				label="Full name"
				htmlFor="enq-name"
				error={errors.fullName?.message}
			>
				<Input
					id="enq-name"
					placeholder="Your name"
					autoComplete="name"
					error={Boolean(errors.fullName)}
					{...register('fullName')}
				/>
			</Field>

			<div className="grid gap-5 sm:grid-cols-2">
				<Field label="Phone" htmlFor="enq-phone" error={errors.phone?.message}>
					<PhoneInput
						id="enq-phone"
						error={Boolean(errors.phone)}
						{...register('phone')}
					/>
				</Field>

				<Field
					label="Email"
					htmlFor="enq-email"
					optional
					error={errors.email?.message}
				>
					<Input
						id="enq-email"
						type="email"
						placeholder="you@email.com"
						autoComplete="email"
						error={Boolean(errors.email)}
						{...register('email')}
					/>
				</Field>
			</div>

			<Field label="Room type" htmlFor="enq-room">
				<Controller
					control={control}
					name="roomType"
					render={({ field }) => (
						<ChipGroup
							label="Room type"
							name="enq-room"
							options={[...ROOM_TYPE_OPTIONS]}
							value={field.value ?? null}
							onChange={(value) => {
								field.onChange(value);
								setChosenRoom(value as EnquiryInput['roomType']);
							}}
						/>
					)}
				/>
			</Field>

			<Field
				label="Preferred move-in"
				htmlFor="enq-month"
				optional
				error={errors.moveInMonth?.message}
			>
				<MonthPicker
					id="enq-month"
					error={Boolean(errors.moveInMonth)}
					{...register('moveInMonth')}
				/>
			</Field>

			<Field label="Anything else?" htmlFor="enq-message" optional>
				<Textarea
					id="enq-message"
					rows={3}
					placeholder="Which college you're at, questions about food, timings…"
					{...register('message')}
				/>
			</Field>

			{formError ? (
				<SubmitError
					// Read rather than watched: this renders only after a failed
					// submit, so the value is settled, and watching the name would
					// re-render the whole form on every keystroke.
					context={{ roomType: chosenRoom, name: getValues('fullName') }}
					message={formError}
					onRetry={canRetry ? () => void onSubmit() : undefined}
					retrying={isSubmitting}
				/>
			) : null}

			<Button
				type="submit"
				size="lg"
				disabled={isSubmitting}
				className="w-full"
			>
				{isSubmitting ? 'Sending…' : 'Send enquiry'}
			</Button>

			<div className="flex items-center gap-3">
				<span className="h-px flex-1 bg-line-soft" />
				<span className="text-xs text-label">or</span>
				<span className="h-px flex-1 bg-line-soft" />
			</div>

			<Button asChild variant="secondary" size="lg" className="w-full">
				<a
					href={chatHrefForRoom(chosenRoom)}
					target="_blank"
					rel="noopener noreferrer"
				>
					<Icon name="chat" size={18} className="text-chat" />
					Chat on {CHAT.label} instead
				</a>
			</Button>

			<p className="text-center text-xs text-label">
				No payment is taken on this site. We confirm everything on a call.
			</p>
		</form>
	);
}
