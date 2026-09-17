'use client';

import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { debugError } from '@/utils/Logger';
import { CHAT, CONTACT } from '@/utils/SiteConfig';
import { useEffect } from 'react';

/**
 * Whole-page error boundary.
 *
 * The most likely cause in production is the database being unreachable — the
 * Supabase free tier pauses after a week idle, and every content page reads
 * from it. So this page does not just apologise: it gives the phone number and
 * the WhatsApp link, because a visitor who cannot load the site can still
 * become a resident if they can reach a person.
 */
export default function ErrorBoundary({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		debugError('[page error]', error);
	}, [error]);

	return (
		<Container className="flex flex-col items-center gap-6 py-24 text-center lg:py-32">
			<span className="flex size-14 items-center justify-center rounded-pill bg-warn-tint text-warn">
				<Icon name="security" size={26} />
			</span>

			<h1 className="max-w-[22ch] font-display text-3xl font-semibold text-balance text-ink sm:text-section">
				Something went wrong at our end.
			</h1>

			<p className="max-w-[46ch] text-base leading-relaxed text-body">
				This is us, not you. Try again in a moment — or skip the website
				entirely and just call, which is faster anyway.
			</p>

			<div className="flex flex-col gap-3 pt-2 sm:flex-row">
				<Button size="lg" onClick={reset}>
					Try again
				</Button>
				<Button asChild variant="secondary" size="lg">
					<a href={CONTACT.phoneHref}>
						<Icon name="phone" size={17} />
						{CONTACT.phoneDisplay}
					</a>
				</Button>
				<Button asChild variant="chat" size="lg">
					<a href={CHAT.url} target="_blank" rel="noopener noreferrer">
						<Icon name="chat" size={17} />
						{CHAT.label}
					</a>
				</Button>
			</div>

			{error.digest ? (
				<p className="pt-2 text-xs text-label">Reference: {error.digest}</p>
			) : null}
		</Container>
	);
}
