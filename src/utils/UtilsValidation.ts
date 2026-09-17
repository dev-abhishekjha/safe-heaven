import { z } from 'zod';

/**
 * One schema, used by the browser and the server action.
 *
 * Sharing it is the point: client-side validation is a convenience that a
 * determined visitor can skip, so the server re-runs exactly the same rules.
 * Two schemas that drift apart is how bad data gets in.
 */

const ROOM_TYPES = ['single', 'double', 'triple', 'unsure'] as const;
const SUBJECTS = ['booking', 'visit', 'parent', 'other'] as const;

/** Indian mobile numbers: ten digits, first is 6–9. */
const phone = z
	.string()
	.trim()
	.regex(/^[6-9]\d{9}$/, 'Enter a 10-digit mobile number');

const fullName = z
	.string()
	.trim()
	.min(2, 'Please enter your name')
	.max(80, 'That name is too long');

/** Optional email — blank is fine, but a typo should not be. */
const optionalEmail = z
	.union([z.literal(''), z.email('Enter a valid email address')])
	.optional();

const message = z
	.string()
	.trim()
	.max(1000, 'Please keep it under 1000 characters')
	.optional();

export const enquirySchema = z.object({
	fullName,
	phone,
	email: optionalEmail,
	roomType: z.enum(ROOM_TYPES).optional(),
	/** `YYYY-MM` from the native month input. */
	moveInMonth: z
		.union([z.literal(''), z.string().regex(/^\d{4}-\d{2}$/, 'Pick a month')])
		.optional(),
	message,
	source: z.string().max(200).optional(),
	/**
	 * Honeypot. Real people never see this field, so anything in it is a bot.
	 * Named plausibly on purpose — `honeypot` would be trivially skipped.
	 */
	company: z.string().max(0).optional(),
});

export const contactSchema = enquirySchema.extend({
	subject: z.enum(SUBJECTS),
	message: z.string().trim().min(1, 'Tell us what you need').max(1000),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
export type ContactInput = z.infer<typeof contactSchema>;

export const ROOM_TYPE_OPTIONS = [
	{ value: 'single', label: 'Single' },
	{ value: 'double', label: 'Double' },
	{ value: 'triple', label: 'Triple' },
	{ value: 'unsure', label: 'Not sure' },
] as const;

export const SUBJECT_OPTIONS = [
	{ value: 'booking', label: 'Booking a room' },
	{ value: 'visit', label: 'Visiting the property' },
	{ value: 'parent', label: 'Parent enquiry' },
	{ value: 'other', label: 'Something else' },
] as const;

/** What a form submission returns. Never throws across the boundary. */
export type SubmitResult =
	| { ok: true }
	| { ok: false; error: string; fieldErrors?: Record<string, string> };
