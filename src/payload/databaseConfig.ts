/**
 * Postgres connection settings.
 *
 * Why this exists rather than handing `connectionString` straight to the
 * adapter: node-postgres does
 *
 *     config = Object.assign({}, config, parse(config.connectionString))
 *
 * in `pg/lib/connection-parameters.js`, so the connection string WINS over any
 * explicit field you pass beside it. An explicit `password` next to a
 * `connectionString` that already contains one is silently discarded — which
 * means a stale password inside `DATABASE_URI` keeps being used no matter what
 * `DATABASE_PASSWORD` is set to, and the only symptom is `28P01 password
 * authentication failed`.
 *
 * So the URI is parsed here into discrete fields and the password is chosen
 * explicitly. That also removes the escaping trap: a password containing `@`,
 * `#`, `/` or `?` cannot be written literally inside a URI, and `#` in
 * particular starts a comment in a dotenv file. `DATABASE_PASSWORD` is read
 * as-is, so none of that applies to it.
 */

export type PoolConfig = {
	host: string;
	port: number;
	user: string;
	password: string;
	database: string;
	ssl?: { rejectUnauthorized: boolean };
	/** Connections per instance — see the note in buildPoolConfig. */
	max?: number;
	idleTimeoutMillis?: number;
	connectionTimeoutMillis?: number;
};

export function buildPoolConfig(
	uri = process.env.DATABASE_URI || '',
	explicitPassword = process.env.DATABASE_PASSWORD || '',
): PoolConfig {
	if (!uri) {
		// Next surfaces this as "Failed to collect page data for /api/[...slug]",
		// which points nowhere near the cause, so the message has to carry the
		// whole diagnosis itself — including where to look on a host.
		throw new Error(
			[
				'DATABASE_URI is not set, so Payload cannot start and the build cannot collect page data.',
				'',
				'Locally:  copy .env.example to .env.local and fill it in.',
				'On Vercel: Project Settings -> Environment Variables. Set DATABASE_URI,',
				'           DATABASE_PASSWORD and PAYLOAD_SECRET for the Production environment',
				'           (and Preview, if you deploy branches), then redeploy.',
			].join('\n'),
		);
	}

	let parsed: URL;
	try {
		parsed = new URL(uri);
	} catch {
		throw new Error(
			'DATABASE_URI is not a valid connection string. It should look like postgresql://user:password@host:5432/database',
		);
	}

	// `URL` percent-decodes these for us, which is the correct behaviour for a
	// password that was encoded to survive being written into a URI.
	const uriPassword = decodeURIComponent(parsed.password || '');

	const port = parsed.port ? Number(parsed.port) : 5432;

	return {
		host: parsed.hostname,
		port,
		user: decodeURIComponent(parsed.username || ''),
		// DATABASE_PASSWORD wins. It is the one that is not subject to URI
		// escaping, so it is the one that can be trusted to be what was typed.
		password: explicitPassword || uriPassword,
		database: parsed.pathname.replace(/^\//, '') || 'postgres',
		// Supabase terminates TLS at the pooler with a certificate that does not
		// chain to a public root, which is standard for their managed pooler.
		ssl: { rejectUnauthorized: false },
		/**
		 * Serverless sizing.
		 *
		 * Each Vercel function instance gets its own pool, and there can be many
		 * instances at once. A default-sized pool per instance exhausts the
		 * database's connection limit under very ordinary traffic, and the
		 * failure looks like random timeouts rather than anything obvious.
		 * One connection per instance, handed back quickly, is the shape that
		 * works — the pooler in front is what does the actual pooling.
		 *
		 * Locally the opposite is true: one long-lived dev server, so a slightly
		 * larger pool avoids serialising every request behind one connection.
		 */
		max: process.env.NODE_ENV === 'production' ? 1 : 5,
		idleTimeoutMillis: 10_000,
		connectionTimeoutMillis: 15_000,
	};
}

/**
 * Which Supabase pooler port to use, for the record.
 *
 * 5432 is the SESSION pooler: connections are held for the life of the client.
 * Right for a long-lived server and required for migrations.
 *
 * 6543 is the TRANSACTION pooler: a connection is borrowed per transaction and
 * returned. That is the right shape for serverless functions.
 *
 * A caveat that is often repeated and does NOT apply here: the transaction
 * pooler cannot carry session state, so it breaks named prepared statements.
 * That bites stacks built on postgres.js. Payload's adapter uses node-postgres
 * (`pg`), which does not issue prepared statements unless a query is explicitly
 * named, so there is nothing to disable — no `prepare: false` equivalent exists
 * in these types, which is the tell.
 */
