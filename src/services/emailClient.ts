import 'server-only';

import { debugWarn } from '@/utils/Logger';
import { ADDRESS, CONTACT } from '@/utils/SiteConfig';
import { Resend } from 'resend';

/**
 * Outbound email.
 *
 * Named for the role, not the vendor — swapping Resend for anything else is a
 * change inside this file (AGENTS.md).
 *
 * Every function degrades to a no-op with a warning rather than throwing. An
 * enquiry that reaches the database but fails to email is a problem to fix;
 * an enquiry lost because the mail provider was down is a lost customer.
 */

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.RESEND_FROM;
const notifyTo = process.env.LEAD_NOTIFY_EMAIL;

const client = apiKey ? new Resend(apiKey) : null;

type SendArgs = {
	to: string;
	subject: string;
	text: string;
};

async function send({ to, subject, text }: SendArgs): Promise<boolean> {
	if (!client || !from) {
		// Expected until a domain is verified in Resend — see E16.5.
		debugWarn(
			`[email] skipped "${subject}" — ${!client ? 'RESEND_API_KEY' : 'RESEND_FROM'} is not set`,
		);
		return false;
	}

	try {
		await client.emails.send({ from, to, subject, text });
		return true;
	} catch (error) {
		debugWarn('[email] send failed:', error);
		return false;
	}
}

type LeadSummary = {
	fullName: string;
	phone: string;
	email?: string;
	roomType?: string;
	moveInMonth?: string;
	message?: string;
	source?: string;
};

/** Tells the team an enquiry landed. Subject carries enough to triage. */
export async function sendLeadNotification(
	lead: LeadSummary,
): Promise<boolean> {
	if (!notifyTo) {
		debugWarn(
			'[email] skipped lead notification — LEAD_NOTIFY_EMAIL is not set',
		);
		return false;
	}

	const lines = [
		`Name:      ${lead.fullName}`,
		`Phone:     +91 ${lead.phone}`,
		lead.email ? `Email:     ${lead.email}` : null,
		lead.roomType ? `Room type: ${lead.roomType}` : null,
		lead.moveInMonth ? `Move-in:   ${lead.moveInMonth}` : null,
		lead.source ? `From page: ${lead.source}` : null,
		lead.message ? `\nMessage:\n${lead.message}` : null,
	].filter(Boolean);

	return send({
		to: notifyTo,
		subject: `New enquiry — ${lead.fullName}, ${lead.roomType ?? 'room not specified'}`,
		text: lines.join('\n'),
	});
}

/**
 * Confirmation to the enquirer.
 *
 * Gated on a verified sending domain: Resend's test sender only delivers to
 * the account owner, so without RESEND_FROM this would fail for every real
 * visitor. Enabled at E16.5.
 */
export async function sendEnquiryConfirmation(
	lead: LeadSummary,
): Promise<boolean> {
	if (!lead.email) return false;

	return send({
		to: lead.email,
		subject: 'We got your enquiry — Safe Heaven Accomodations',
		text: [
			`Hi ${lead.fullName},`,
			'',
			'Thanks for getting in touch. Someone from Safe Heaven will call you within 24 hours with rent and availability.',
			'',
			`In a hurry? Call ${CONTACT.phoneDisplay} or message us on WhatsApp.`,
			'',
			`${ADDRESS.line1}, ${ADDRESS.line2}`,
		].join('\n'),
	});
}
