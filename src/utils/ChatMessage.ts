import { CHAT } from '@/utils/SiteConfig';
import type { EnquiryInput } from '@/utils/UtilsValidation';

/**
 * WhatsApp links that carry what we already know.
 *
 * Every chat link on the site used to open an empty WhatsApp thread. Five call
 * sites passed a static sentence; eight passed nothing at all — including the
 * enquiry modal's success state, the mobile action bar, and `SubmitError`,
 * which is the link a visitor reaches for immediately after their enquiry
 * failed to save. That one mattered most and was the emptiest: someone whose
 * form just failed arrived in WhatsApp with a blank box and had to type it all
 * again, having already been let down once.
 *
 * Lives in its own module rather than in `SiteConfig` so the wording can change
 * without touching the file every server module imports.
 *
 * The messages say what the person wants, not what our form fields are called.
 * Nobody types "roomType: double" to a landlord.
 */

const WHERE = 'Safe Haven, Mitra Enclave';

/** `roomType` is optional on the schema; the key type must not be. */
type RoomType = NonNullable<EnquiryInput['roomType']>;

/** Only the rooms worth naming — "not sure" is the absence of a choice. */
const ROOM_PHRASE: Partial<Record<RoomType, string>> = {
	single: 'a single room',
	double: 'a double sharing room',
	triple: 'a triple sharing room',
};

const roomPhrase = (roomType?: RoomType) =>
	(roomType && ROOM_PHRASE[roomType]) || 'rooms';

export type ChatContext = {
	roomType?: RoomType;
	name?: string;
};

/** No context to carry — the nav drawer, the action bar, the error page. */
export function chatHref(): string {
	return CHAT.urlWithMessage(`Hi, I'd like to know about rooms at ${WHERE}.`);
}

/** Browsing, or part-way through the form: carry the room if one is chosen. */
export function chatHrefForRoom(roomType?: RoomType): string {
	return CHAT.urlWithMessage(
		`Hi, I'd like to know about ${roomPhrase(roomType)} at ${WHERE}.`,
	);
}

/**
 * After an enquiry saved. They have already told us everything, so the message
 * identifies them rather than asking them to start again.
 */
export function chatHrefAfterEnquiry({ name, roomType }: ChatContext): string {
	const who = name?.trim() ? ` My name is ${name.trim()}.` : '';
	return CHAT.urlWithMessage(
		`Hi, I've just sent an enquiry through your website about ${roomPhrase(roomType)}.${who}`,
	);
}

/**
 * After an enquiry FAILED. The whole point is that nothing they typed is lost,
 * so the message carries it across and says plainly that the form did not work
 * — otherwise they look like someone enquiring twice.
 */
export function chatHrefAfterFailure({ name, roomType }: ChatContext): string {
	const who = name?.trim() ? ` My name is ${name.trim()}.` : '';
	return CHAT.urlWithMessage(
		`Hi, I tried to send an enquiry on your website about ${roomPhrase(roomType)} but it didn't go through.${who}`,
	);
}
