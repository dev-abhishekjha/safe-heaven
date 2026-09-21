/**
 * TEMPORARY connectivity diagnostic. Delete once the Vercel -> Supabase
 * connection is understood (see docs/TASKS.md E16).
 *
 * Why this exists: every Postgres query from Vercel fails with pg-pool's
 * "timeout exceeded when trying to connect", while the exact same host, port,
 * user and password connect from a laptop in under half a second. Guessing at
 * the difference has already produced three wrong answers, so this route runs
 * the checks INSIDE the failing environment and reports what it finds.
 *
 * It is inert unless DIAG_TOKEN is set, and it never returns a secret — only
 * lengths and sha256 fingerprints, which are enough to compare an environment
 * variable on Vercel with the one on a laptop without revealing either.
 *
 * Call it with the token in a header, not the query string, so it does not end
 * up in request logs:
 *
 *     curl -s -H "x-diag-token: $DIAG_TOKEN" https://<host>/diag | jq
 */

import { createHash, timingSafeEqual } from 'node:crypto';
import { promises as dns } from 'node:dns';
import net from 'node:net';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Generous, because the whole point is to observe things that time out.
export const maxDuration = 60;

const TCP_TIMEOUT_MS = 6_000;
const PG_TIMEOUT_MS = 8_000;
const HTTPS_TIMEOUT_MS = 6_000;

type Json = Record<string, unknown>;

function fingerprint(value: string): string {
	return createHash('sha256').update(value).digest('hex').slice(0, 12);
}

function errorShape(error: unknown): Json {
	const e = error as NodeJS.ErrnoException & { code?: string | number };
	return {
		message: e?.message ?? String(error),
		code: e?.code,
		errno: e?.errno,
		syscall: e?.syscall,
		cause: e?.cause ? String((e.cause as Error).message ?? e.cause) : undefined,
	};
}

function authorised(request: Request): boolean {
	const expected = process.env.DIAG_TOKEN ?? '';
	if (!expected) return false;
	const given = request.headers.get('x-diag-token') ?? '';
	// Hash both first so the comparison is over equal-length buffers.
	return timingSafeEqual(
		createHash('sha256').update(given).digest(),
		createHash('sha256').update(expected).digest(),
	);
}

/**
 * Report the SHAPE of an environment variable, never its value.
 *
 * `trailingWhitespace` and `rawLength` are here on purpose: a value pasted
 * into a host's variable editor with a stray newline or space is invisible in
 * the UI and breaks a hostname or a password silently.
 */
function describeVar(name: string): Json {
	const raw = process.env[name];
	if (raw === undefined) return { present: false };
	const trimmed = raw.trim();
	return {
		present: true,
		rawLength: raw.length,
		trimmedLength: trimmed.length,
		leadingOrTrailingWhitespace: raw !== trimmed,
		fingerprint: fingerprint(trimmed),
	};
}

/**
 * Parse a connection URI the same way the app does, and surface the parts that
 * go wrong silently. `hash` is the important one: an unescaped `#` in a
 * password ends the authority, so the host becomes a fragment of the password
 * and everything after it disappears into the fragment.
 */
function describeUri(name: string): Json {
	const raw = process.env[name];
	if (raw === undefined) return { present: false };
	const trimmed = raw.trim();
	const base: Json = {
		present: true,
		rawLength: raw.length,
		leadingOrTrailingWhitespace: raw !== trimmed,
	};
	let url: URL;
	try {
		url = new URL(trimmed);
	} catch (error) {
		return { ...base, parseError: errorShape(error) };
	}
	const uriPassword = url.password ? decodeURIComponent(url.password) : '';
	return {
		...base,
		protocol: url.protocol,
		host: url.hostname,
		port: url.port || '(absent, defaults to 5432)',
		user: decodeURIComponent(url.username || ''),
		database:
			url.pathname.replace(/^\//, '') || '(absent, defaults to postgres)',
		search: url.search || null,
		// Non-null here means the URI was truncated by an unescaped '#'.
		hash: url.hash || null,
		uriPassword: url.password
			? { length: uriPassword.length, fingerprint: fingerprint(uriPassword) }
			: null,
	};
}

async function dnsCheck(host: string): Promise<Json> {
	const started = Date.now();
	const [a, aaaa, lookup] = await Promise.all([
		dns.resolve4(host).catch((error) => errorShape(error)),
		dns.resolve6(host).catch((error) => errorShape(error)),
		dns
			.lookup(host, { all: true, verbatim: true })
			.catch((error) => errorShape(error)),
	]);
	return { a, aaaa, lookup, ms: Date.now() - started };
}

function tcpCheck(host: string, port: number): Promise<Json> {
	return new Promise((resolve) => {
		const started = Date.now();
		const socket = net.createConnection({ host, port });
		const finish = (result: Json) => {
			socket.destroy();
			resolve({ ...result, ms: Date.now() - started });
		};
		socket.setTimeout(TCP_TIMEOUT_MS);
		socket.once('connect', () =>
			finish({
				ok: true,
				remoteAddress: socket.remoteAddress,
				remoteFamily: socket.remoteFamily,
				localAddress: socket.localAddress,
			}),
		);
		socket.once('timeout', () =>
			finish({ ok: false, error: `no response within ${TCP_TIMEOUT_MS}ms` }),
		);
		socket.once('error', (error) =>
			finish({ ok: false, ...errorShape(error) }),
		);
	});
}

async function pgCheck(
	host: string,
	port: number,
	user: string,
	password: string,
	database: string,
): Promise<Json> {
	const started = Date.now();
	// Imported dynamically so a missing `pg` cannot break the route's other
	// checks, which are the ones that still work when the driver is the problem.
	const { Client } = await import('pg');
	const client = new Client({
		host,
		port,
		user,
		password,
		database,
		ssl: { rejectUnauthorized: false },
		connectionTimeoutMillis: PG_TIMEOUT_MS,
	});
	try {
		await client.connect();
		const result = await client.query(
			'select current_user as "currentUser", current_database() as "database", version() as version',
		);
		return { ok: true, ms: Date.now() - started, ...result.rows[0] };
	} catch (error) {
		return { ok: false, ms: Date.now() - started, ...errorShape(error) };
	} finally {
		await client.end().catch(() => undefined);
	}
}

async function httpsCheck(url: string): Promise<Json> {
	const started = Date.now();
	try {
		const response = await fetch(url, {
			method: 'GET',
			signal: AbortSignal.timeout(HTTPS_TIMEOUT_MS),
		});
		return { ok: true, status: response.status, ms: Date.now() - started };
	} catch (error) {
		return { ok: false, ms: Date.now() - started, ...errorShape(error) };
	}
}

function uriPassword(): string {
	const raw = process.env.DATABASE_URI?.trim();
	if (!raw) return '';
	try {
		return decodeURIComponent(new URL(raw).password || '');
	} catch {
		return '';
	}
}

export async function GET(request: Request): Promise<Response> {
	if (!authorised(request)) {
		// 404 rather than 401: an unconfigured or wrongly-called diagnostic should
		// not announce that it exists.
		return new Response('Not found', { status: 404 });
	}

	const uri = describeUri('DATABASE_URI');
	const directUri = describeUri('DATABASE_DIRECT_URI');

	// Build the target matrix from whatever is actually configured, then add the
	// sibling pooler port so both are always measured from the same place.
	const targets = new Map<string, { host: string; port: number }>();
	for (const source of [uri, directUri]) {
		const host = source.host as string | undefined;
		if (!host) continue;
		const port = Number.parseInt(String(source.port), 10);
		for (const candidate of [Number.isNaN(port) ? 5432 : port, 5432, 6543]) {
			targets.set(`${host}:${candidate}`, { host, port: candidate });
		}
	}

	// Same precedence as buildPoolConfig: DATABASE_PASSWORD wins, the password
	// inside the URI is the fallback.
	const password = process.env.DATABASE_PASSWORD?.trim() || uriPassword();
	const user = (uri.user as string) ?? '';
	const database =
		typeof uri.database === 'string' && !uri.database.startsWith('(')
			? uri.database
			: 'postgres';

	const hosts = [...new Set([...targets.values()].map((t) => t.host))];

	const [dnsResults, tcpResults, pgResults, egress] = await Promise.all([
		Promise.all(
			hosts.map(async (host) => [host, await dnsCheck(host)] as const),
		),
		Promise.all(
			[...targets.entries()].map(
				async ([label, t]) => [label, await tcpCheck(t.host, t.port)] as const,
			),
		),
		Promise.all(
			[...targets.entries()].map(
				async ([label, t]) =>
					[
						label,
						password
							? await pgCheck(t.host, t.port, user, password, database)
							: { skipped: 'DATABASE_PASSWORD is not set' },
					] as const,
			),
		),
		Promise.all([
			httpsCheck('https://api.github.com/zen'),
			httpsCheck('https://supabase.com/favicon.ico'),
		]),
	]);

	return Response.json(
		{
			generatedAt: new Date().toISOString(),
			runtime: {
				node: process.version,
				platform: `${process.platform}/${process.arch}`,
				vercelRegion: process.env.VERCEL_REGION ?? null,
				vercelEnv: process.env.VERCEL_ENV ?? null,
				commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
			},
			variables: {
				DATABASE_URI: uri,
				DATABASE_DIRECT_URI: directUri,
				DATABASE_PASSWORD: describeVar('DATABASE_PASSWORD'),
				PAYLOAD_SECRET: describeVar('PAYLOAD_SECRET'),
				NEXT_PUBLIC_SERVER_URL: describeVar('NEXT_PUBLIC_SERVER_URL'),
				S3_ENDPOINT: describeVar('S3_ENDPOINT'),
				databaseKeysSeen: Object.keys(process.env)
					.filter((key) => /^(DATABASE|PAYLOAD|S3|RESEND)/.test(key))
					.sort(),
			},
			dns: Object.fromEntries(dnsResults),
			tcp: Object.fromEntries(tcpResults),
			postgres: Object.fromEntries(pgResults),
			egress: {
				'api.github.com:443': egress[0],
				'supabase.com:443': egress[1],
			},
		},
		{ headers: { 'cache-control': 'no-store' } },
	);
}
