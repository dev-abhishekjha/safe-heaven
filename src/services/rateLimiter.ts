import 'server-only';

import { createHash } from 'node:crypto';

/**
 * A sliding-window rate limiter for the enquiry path.
 *
 * WHAT THIS IS HONEST ABOUT: the window lives in the memory of one server
 * instance. On Vercel that means a determined attacker who spreads requests
 * across cold starts gets more through than the limit suggests, and the
 * counters reset on every deploy. It is a speed bump, not a wall.
 *
 * It is still worth having. The realistic threat to this site is not a
 * targeted attack, it is a scraper or a broken script hammering the form and
 * filling the admin panel with junk — and that comes from one address in a
 * burst, which this stops. The honeypot handles naive bots, and there is
 * deliberately no captcha: friction on a student enquiry form costs more real
 * leads than it blocks fake ones.
 *
 * If volume ever justifies it, the upgrade is a shared store (Upstash, or a
 * Postgres table) — `check()` is the only function that would change.
 *
 * PRIVACY: the raw IP is never stored. It is hashed with the app secret and
 * kept only as long as the window, so nothing here is a record of who visited.
 */

type Window = { count: number; resetAt: number };

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

const windows = new Map<string, Window>();

/** Keeps the map from growing without bound on a long-lived instance. */
function sweep(now: number) {
	if (windows.size < 500) {
		return;
	}
	for (const [key, window] of windows) {
		if (window.resetAt <= now) {
			windows.delete(key);
		}
	}
}

/** Hash rather than store. The salt means the hashes are useless elsewhere. */
export function clientKey(ip: string | null): string {
	return createHash('sha256')
		.update(`${process.env.PAYLOAD_SECRET ?? 'unsalted'}:${ip ?? 'unknown'}`)
		.digest('hex')
		.slice(0, 32);
}

export type RateLimitResult = {
	allowed: boolean;
	/** Seconds until the window resets — used to write a useful message. */
	retryAfterSeconds: number;
};

export function check(key: string): RateLimitResult {
	const now = Date.now();
	sweep(now);

	const existing = windows.get(key);

	if (!existing || existing.resetAt <= now) {
		windows.set(key, { count: 1, resetAt: now + WINDOW_MS });
		return { allowed: true, retryAfterSeconds: 0 };
	}

	existing.count += 1;

	if (existing.count > MAX_PER_WINDOW) {
		return {
			allowed: false,
			retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
		};
	}

	return { allowed: true, retryAfterSeconds: 0 };
}

/** Test seam — not used by the app. */
export function reset() {
	windows.clear();
}
