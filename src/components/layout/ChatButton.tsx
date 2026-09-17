import { Icon } from '@/components/ui/Icon';
import { CHAT } from '@/utils/SiteConfig';

const DEFAULT_MESSAGE =
	"Hi, I'd like to know about rooms at Safe Haven, Mitra Enclave.";

/**
 * Floating chat button — desktop only; phones get the action bar instead,
 * where a floating circle would collide with it.
 *
 * The message is pre-filled so the first thing the team reads is context
 * rather than "hi".
 */
export function ChatButton() {
	return (
		<a
			href={CHAT.urlWithMessage(DEFAULT_MESSAGE)}
			target="_blank"
			rel="noopener noreferrer"
			aria-label={`Message us on ${CHAT.label}`}
			className="fixed bottom-7 right-7 z-30 hidden size-14 items-center justify-center rounded-pill bg-chat text-white shadow-card transition-transform hover:scale-105 md:flex"
		>
			<Icon name="chat" size={26} />
		</a>
	);
}
