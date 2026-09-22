'use client';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { type ChatContext, chatHrefAfterFailure } from '@/utils/ChatMessage';
import { CHAT, CONTACT } from '@/utils/SiteConfig';

type SubmitErrorProps = {
	message: string;
	/** Present when retrying could plausibly work — a network blip, not a 400. */
	onRetry?: () => void;
	retrying?: boolean;
	/**
	 * What they had typed. Carried into the WhatsApp message so the person who
	 * just watched a form fail does not have to type it a second time.
	 */
	context?: ChatContext;
};

/**
 * What a visitor sees when a submission fails.
 *
 * Three things, in order of how much they help:
 *
 * 1. A retry button, because the common cause is a dropped connection on a
 *    phone and the fix is pressing it again. Nothing is cleared when this
 *    renders — everything they typed is still in the form, which is the whole
 *    point. Losing a filled-in form to one bad tunnel is how an enquiry
 *    becomes a competitor's enquiry.
 * 2. The phone number, because someone who has already failed once should not
 *    be asked to trust the same form twice.
 * 3. WhatsApp, for anyone who would rather not call — pre-filled with what
 *    they typed, and saying the form failed, so they are not mistaken for
 *    someone enquiring twice.
 *
 * `role="alert"` so a screen reader announces it rather than leaving someone
 * wondering whether the button did anything.
 */
export function SubmitError({
	message,
	onRetry,
	retrying,
	context,
}: SubmitErrorProps) {
	return (
		<div
			role="alert"
			className="flex flex-col gap-3 rounded-field border border-danger bg-danger/5 p-4"
		>
			<p className="text-sm leading-relaxed text-danger-ink">{message}</p>

			<div className="flex flex-wrap gap-2">
				{onRetry ? (
					<Button size="sm" onClick={onRetry} disabled={retrying}>
						{retrying ? 'Trying…' : 'Try again'}
					</Button>
				) : null}
				<Button asChild size="sm" variant="secondary">
					<a href={CONTACT.phoneHref}>
						<Icon name="phone" size={15} aria-hidden />
						{CONTACT.phoneDisplay}
					</a>
				</Button>
				<Button asChild size="sm" variant="chat">
					<a
						href={chatHrefAfterFailure(context ?? {})}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Icon name="chat" size={15} aria-hidden />
						{CHAT.label}
					</a>
				</Button>
			</div>
		</div>
	);
}
