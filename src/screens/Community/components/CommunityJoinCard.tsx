'use client';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Panel } from '@/components/ui/Panel';
import { ANALYTICS_EVENTS, trackEvent } from '@/utils/Analytics';
import { CHAT, COMMUNITY } from '@/utils/SiteConfig';

const ASK_FOR_LINK =
	'Hi, I saw the Safe Haven website — could you send me the resident WhatsApp community link?';

/**
 * The join card. This is the page's single purpose.
 *
 * Two states, and the second one is the point. While `COMMUNITY.inviteUrl` is
 * null (E15.9), there is no button pretending to be a group link: the card
 * says the link is not published yet and offers the one thing that does work,
 * which is asking a person for it. A dead invite button would cost a real
 * resident and teach everyone else that the site's buttons are decorative.
 *
 * The link is read from config, never written here, so the day it moves to
 * `siteSettings` this component does not change.
 */
export function CommunityJoinCard() {
	const inviteUrl = COMMUNITY.inviteUrl;

	return (
		<Panel tone="chat" className="flex flex-col items-start gap-5">
			<span className="flex size-12 items-center justify-center rounded-pill bg-chat text-white">
				<Icon name="chat" size={22} aria-hidden />
			</span>

			<div className="flex flex-col gap-2">
				<h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
					{inviteUrl
						? 'Join the resident community'
						: 'The group link is not public yet'}
				</h2>
				<p className="max-w-[52ch] text-base leading-relaxed text-body">
					{inviteUrl
						? `Everything above happens in one ${CHAT.label} group. Residents join when they move in, and it stays useful because it is only residents.`
						: `The ${CHAT.label} community is running, but we hand the link out directly rather than posting it. Message us and we will add you.`}
				</p>
			</div>

			{inviteUrl ? (
				<Button
					asChild
					variant="chat"
					size="lg"
					onClick={() =>
						trackEvent(ANALYTICS_EVENTS.whatsappCommunityJoin, {
							location: 'community-page',
						})
					}
				>
					<a href={inviteUrl} target="_blank" rel="noopener noreferrer">
						<Icon name="chat" size={18} aria-hidden />
						Join on {CHAT.label}
					</a>
				</Button>
			) : (
				<Button
					asChild
					variant="chat"
					size="lg"
					onClick={() =>
						trackEvent(ANALYTICS_EVENTS.whatsappChat, {
							location: 'community-page-request-link',
						})
					}
				>
					<a
						href={CHAT.urlWithMessage(ASK_FOR_LINK)}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Icon name="chat" size={18} aria-hidden />
						Ask us for the link
					</a>
				</Button>
			)}

			{inviteUrl ? (
				<p className="text-sm text-muted">{COMMUNITY.note}</p>
			) : null}
		</Panel>
	);
}
