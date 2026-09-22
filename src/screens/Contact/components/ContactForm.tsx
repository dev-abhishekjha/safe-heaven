'use client';

import { submitContactAction } from '@/app/(frontend)/actions';
import { SubmitError } from '@/components/enquiry/SubmitError';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Icon } from '@/components/ui/Icon';
import { Input, PhoneInput, Select, Textarea } from '@/components/ui/Input';
import { chatHref } from '@/utils/ChatMessage';
import { CHAT } from '@/utils/SiteConfig';
import {
	type ContactInput,
	SUBJECT_OPTIONS,
	contactSchema,
} from '@/utils/UtilsValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

/**
 * The contact form.
 *
 * Shares `contactSchema` and `submitContactAction` with the enquiry popup, so
 * the two write the same shape into `leads` and differ only by `type`. The
 * subject dropdown is the reason this form exists separately: "parent enquiry"
 * and "booking a room" want different people to answer, and knowing which
 * before you call back is worth the one extra field.
 *
 * Success is rendered in place. A redirect to a thank-you page would lose the
 * page they were reading and give them nothing to do next.
 */
export function ContactForm() {
	const [sent, setSent] = useState<{ name: string } | null>(null);
	const [formError, setFormError] = useState<string | null>(null);
	const [canRetry, setCanRetry] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ContactInput>({
		resolver: zodResolver(contactSchema),
		defaultValues: {
			fullName: '',
			phone: '',
			email: '',
			subject: 'booking',
			message: '',
			company: '',
		},
	});

	const onSubmit = handleSubmit(async (values) => {
		setFormError(null);
		setCanRetry(false);

		try {
			const result = await submitContactAction({
				...values,
				source: 'contact-page',
			});

			if (result.ok) {
				setSent({ name: values.fullName });
				return;
			}

			setFormError(result.error);
		} catch {
			setFormError(
				'We could not reach our server just now — that is usually the connection rather than anything you did. Nothing you typed has been lost.',
			);
			setCanRetry(true);
		}
	});

	if (sent) {
		return (
			<div className="flex flex-col items-start gap-4">
				<span className="flex size-12 items-center justify-center rounded-pill bg-ok-tint text-ok">
					<Icon name="check" size={24} aria-hidden />
				</span>
				<h3 className="font-display text-2xl font-semibold text-ink">
					Thanks, {sent.name}. We have it.
				</h3>
				<p className="max-w-[46ch] text-base leading-relaxed text-body">
					Someone will call you back. If it is urgent, {CHAT.label} is faster
					than waiting.
				</p>
				<Button asChild variant="chat">
					<a href={chatHref()} target="_blank" rel="noopener noreferrer">
						<Icon name="chat" size={17} aria-hidden />
						Message us on {CHAT.label}
					</a>
				</Button>
			</div>
		);
	}

	return (
		<form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
			{/* Honeypot — off-screen rather than display:none, never announced. */}
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
				htmlFor="contact-name"
				error={errors.fullName?.message}
			>
				<Input
					id="contact-name"
					placeholder="Your name"
					autoComplete="name"
					error={Boolean(errors.fullName)}
					{...register('fullName')}
				/>
			</Field>

			<div className="grid gap-5 sm:grid-cols-2">
				<Field
					label="Phone"
					htmlFor="contact-phone"
					error={errors.phone?.message}
				>
					<PhoneInput
						id="contact-phone"
						error={Boolean(errors.phone)}
						{...register('phone')}
					/>
				</Field>

				<Field
					label="Email"
					htmlFor="contact-email"
					optional
					error={errors.email?.message}
				>
					<Input
						id="contact-email"
						type="email"
						placeholder="you@email.com"
						autoComplete="email"
						error={Boolean(errors.email)}
						{...register('email')}
					/>
				</Field>
			</div>

			<Field
				label="What is this about?"
				htmlFor="contact-subject"
				error={errors.subject?.message}
			>
				<Select
					id="contact-subject"
					error={Boolean(errors.subject)}
					{...register('subject')}
				>
					{SUBJECT_OPTIONS.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</Select>
			</Field>

			<Field
				label="Your message"
				htmlFor="contact-message"
				error={errors.message?.message}
			>
				<Textarea
					id="contact-message"
					rows={4}
					placeholder="What would you like to know?"
					error={Boolean(errors.message)}
					{...register('message')}
				/>
			</Field>

			{formError ? (
				<SubmitError
					message={formError}
					onRetry={canRetry ? () => void onSubmit() : undefined}
					retrying={isSubmitting}
				/>
			) : null}

			<Button type="submit" size="lg" disabled={isSubmitting}>
				{isSubmitting ? 'Sending…' : 'Send message'}
			</Button>

			<p className="text-xs text-label">
				No payment is taken on this site. We confirm everything on a call.
			</p>
		</form>
	);
}
