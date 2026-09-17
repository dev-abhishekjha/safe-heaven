'use server';

import { submitContact, submitEnquiry } from '@/services/leadService';
import { clientKey } from '@/services/rateLimiter';
import type { SubmitResult } from '@/utils/UtilsValidation';
import { headers } from 'next/headers';

/**
 * Server actions — the controller layer.
 *
 * Thin by design (AGENTS.md): take input, call one service, return a typed
 * result. No validation, no database, no email here. They never throw across
 * the boundary, because an unhandled rejection in an action surfaces to the
 * visitor as a blank error overlay rather than a message they can act on.
 *
 * The caller's address is read here rather than in the service, because this
 * is the only layer that knows about HTTP. It is hashed immediately and never
 * stored.
 */
async function callerKey(): Promise<string> {
	const headerList = await headers();
	// Vercel and most proxies set x-forwarded-for; the first entry is the
	// client. x-real-ip is the fallback for other hosts.
	const forwarded = headerList.get('x-forwarded-for');
	const ip = forwarded?.split(',')[0]?.trim() || headerList.get('x-real-ip');
	return clientKey(ip);
}

export async function submitEnquiryAction(
	input: Record<string, unknown>,
): Promise<SubmitResult> {
	return submitEnquiry(input, await callerKey());
}

export async function submitContactAction(
	input: Record<string, unknown>,
): Promise<SubmitResult> {
	return submitContact(input, await callerKey());
}
