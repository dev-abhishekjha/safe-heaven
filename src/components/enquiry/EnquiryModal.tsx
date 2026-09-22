'use client';

import { EnquiryForm } from '@/components/enquiry/EnquiryForm';
import type { EnquiryPrefill } from '@/components/enquiry/EnquiryProvider';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Modal } from '@/components/ui/Modal';
import { chatHrefAfterEnquiry } from '@/utils/ChatMessage';
import { CHAT, CONTACT } from '@/utils/SiteConfig';
import type { EnquiryInput } from '@/utils/UtilsValidation';
import { useState } from 'react';

type EnquiryModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	prefill?: EnquiryPrefill;
};

/** `roomType` is carried so the WhatsApp link can say what they asked about. */
type Sent = {
	name: string;
	phone: string;
	roomType?: EnquiryInput['roomType'];
};

export function EnquiryModal({
	open,
	onOpenChange,
	prefill,
}: EnquiryModalProps) {
	const [sent, setSent] = useState<Sent | null>(null);

	// Clear the confirmation as the dialog closes, so reopening always starts
	// at the form. Done on the close EVENT rather than in an effect watching
	// `open` — the reset is caused by the dismissal, not by a render.
	const handleOpenChange = (next: boolean) => {
		if (!next) setSent(null);
		onOpenChange(next);
	};

	return (
		<Modal
			open={open}
			onOpenChange={handleOpenChange}
			title={sent ? `Got it, ${sent.name.split(' ')[0]}.` : 'Book a visit'}
			description={
				sent
					? undefined
					: "We'll call you back within 24 hours with rent and availability."
			}
		>
			{sent ? (
				<div className="flex flex-col items-center gap-5 pt-2 text-center">
					<span className="flex size-14 items-center justify-center rounded-pill bg-ok-tint text-ok">
						<Icon name="check" size={26} />
					</span>

					<p className="text-[15px] leading-relaxed text-body">
						We&rsquo;ll call{' '}
						<strong className="font-semibold text-ink">+91 {sent.phone}</strong>{' '}
						within 24 hours.
					</p>

					<div className="flex w-full flex-col gap-3 rounded-card bg-surface-alt p-4 text-left">
						<span className="text-eyebrow uppercase text-label">
							In a hurry?
						</span>
						<a
							href={CONTACT.phoneHref}
							className="flex items-center gap-2.5 text-sm text-ink-soft"
						>
							<Icon name="phone" size={16} className="text-accent" />
							{CONTACT.phoneDisplay}
						</a>
						<a
							href={chatHrefAfterEnquiry({
								name: sent.name,
								roomType: sent.roomType,
							})}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2.5 text-sm text-ink-soft"
						>
							<Icon name="chat" size={16} className="text-chat" />
							Message us on {CHAT.label}
						</a>
					</div>

					<Button variant="ghost" onClick={() => handleOpenChange(false)}>
						Back to the site
					</Button>
				</div>
			) : (
				<EnquiryForm
					prefill={prefill}
					onSuccess={(name, phone, roomType) =>
						setSent({ name, phone, roomType })
					}
				/>
			)}
		</Modal>
	);
}
