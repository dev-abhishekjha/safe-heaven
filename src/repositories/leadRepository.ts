import 'server-only';

import type { Lead } from '@/payload-types';
import { getPayloadClient } from '@/repositories/payloadClient';

export type NewLead = {
	type: Lead['type'];
	fullName: string;
	phone: string;
	email?: string;
	roomType?: NonNullable<Lead['roomType']>;
	moveInMonth?: string;
	subject?: NonNullable<Lead['subject']>;
	message?: string;
	/** The page the enquiry was submitted from. */
	source?: string;
};

/**
 * Write an enquiry.
 *
 * Deliberately NOT wrapped in `cache()` — this is the one write path here, and
 * memoising it would silently swallow a second genuine submission.
 *
 * `overrideAccess: false` makes the write run under the collection's own
 * access rules rather than as an implicit superuser. The rules already allow
 * public creation, so this changes nothing today; it means the day someone
 * tightens them, this call obeys instead of quietly bypassing them.
 */
export async function createLead(input: NewLead): Promise<Lead> {
	const payload = await getPayloadClient();

	return payload.create({
		collection: 'leads',
		overrideAccess: false,
		data: {
			...input,
			status: 'new',
		},
	});
}
