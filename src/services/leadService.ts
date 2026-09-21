import 'server-only';

import { createLead } from '@/repositories/leadRepository';
import {
	sendEnquiryConfirmation,
	sendLeadNotification,
} from '@/services/emailClient';
import { check as checkRateLimit } from '@/services/rateLimiter';
import { debugError } from '@/utils/Logger';
import { CONTACT } from '@/utils/SiteConfig';
import {
	type SubmitResult,
	contactSchema,
	enquirySchema,
} from '@/utils/UtilsValidation';

/**
 * Business logic for an enquiry.
 *
 * The order matters: persist first, notify second. Email is best-effort and a
 * failure there must not lose the lead — it is still in the admin panel either
 * way. The reverse order would mean a mail outage costs you customers.
 */

type RawInput = Record<string, unknown>;

async function handle(
	parsed: ReturnType<typeof enquirySchema.safeParse>,
	type: 'booking' | 'contact',
	extra: { subject?: string; clientKey?: string } = {},
): Promise<SubmitResult> {
	if (!parsed.success) {
		const fieldErrors: Record<string, string> = {};
		for (const issue of parsed.error.issues) {
			const key = String(issue.path[0] ?? '');
			if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
		}
		return {
			ok: false,
			error: 'Please check the highlighted fields.',
			fieldErrors,
		};
	}

	const data = parsed.data;

	// Checked after validation but before anything is written, so a flood
	// costs a schema parse rather than a database round trip.
	if (extra.clientKey) {
		const limit = checkRateLimit(extra.clientKey);
		if (!limit.allowed) {
			return {
				ok: false,
				error: `That is a lot of enquiries in a short time. Try again in a few minutes, or just call ${CONTACT.phoneDisplay} — that is faster anyway.`,
			};
		}
	}

	// Honeypot: a real visitor never sees this field.
	if (data.company) {
		// Report success so a bot learns nothing from the response.
		return { ok: true };
	}

	const lead = {
		fullName: data.fullName,
		phone: data.phone,
		email: data.email || undefined,
		roomType: data.roomType,
		moveInMonth: data.moveInMonth || undefined,
		message: data.message || undefined,
		source: data.source || undefined,
	};

	try {
		await createLead({
			type,
			...lead,
			...(extra.subject ? { subject: extra.subject as never } : {}),
		});
	} catch (error) {
		debugError('[lead] could not be saved:', error);
		return {
			ok: false,
			error: `Something went wrong on our side. Please call ${CONTACT.phoneDisplay} or message us on WhatsApp.`,
		};
	}

	// Best effort from here — the lead is already safe.
	await Promise.allSettled([
		sendLeadNotification(lead),
		sendEnquiryConfirmation(lead),
	]);

	return { ok: true };
}

export async function submitEnquiry(
	input: RawInput,
	clientKey?: string,
): Promise<SubmitResult> {
	return handle(enquirySchema.safeParse(input), 'booking', { clientKey });
}

export async function submitContact(
	input: RawInput,
	clientKey?: string,
): Promise<SubmitResult> {
	const parsed = contactSchema.safeParse(input);
	return handle(
		parsed as ReturnType<typeof enquirySchema.safeParse>,
		'contact',
		{
			subject: parsed.success ? parsed.data.subject : undefined,
			clientKey,
		},
	);
}
