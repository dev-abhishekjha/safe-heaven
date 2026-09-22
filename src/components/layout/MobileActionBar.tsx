import { EnquiryButton } from '@/components/enquiry/EnquiryButton';
import { Icon } from '@/components/ui/Icon';
import { chatHref } from '@/utils/ChatMessage';
import { CHAT, CONTACT } from '@/utils/SiteConfig';

/**
 * Fixed call / chat / book bar, phones only.
 *
 * Most of this site's traffic is a student on a phone, and the two things they
 * are most likely to do — ring the number or open WhatsApp — should never be a
 * scroll away. The body reserves space for it so the footer is still reachable.
 */
export function MobileActionBar() {
	return (
		<div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] pt-3 shadow-bar md:hidden">
			<div className="flex items-center gap-2.5">
				<a
					href={CONTACT.phoneHref}
					aria-label={`Call ${CONTACT.phoneDisplay}`}
					className="flex size-12 shrink-0 items-center justify-center rounded-pill border border-line text-ink"
				>
					<Icon name="phone" size={20} />
				</a>
				<a
					href={chatHref()}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={`Message us on ${CHAT.label}`}
					className="flex size-12 shrink-0 items-center justify-center rounded-pill border border-line text-chat"
				>
					<Icon name="chat" size={20} />
				</a>
				<EnquiryButton size="lg" className="flex-1" />
			</div>
		</div>
	);
}
