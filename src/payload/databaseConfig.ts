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
};

export function buildPoolConfig(
	uri = process.env.DATABASE_URI || '',
	explicitPassword = process.env.DATABASE_PASSWORD || '',
): PoolConfig {
	if (!uri) {
		throw new Error(
			'DATABASE_URI is not set. Copy .env.example to .env.local and fill it in.',
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

	return {
		host: parsed.hostname,
		port: parsed.port ? Number(parsed.port) : 5432,
		user: decodeURIComponent(parsed.username || ''),
		// DATABASE_PASSWORD wins. It is the one that is not subject to URI
		// escaping, so it is the one that can be trusted to be what was typed.
		password: explicitPassword || uriPassword,
		database: parsed.pathname.replace(/^\//, '') || 'postgres',
		// Supabase terminates TLS at the pooler with a certificate that does not
		// chain to a public root, which is standard for their managed pooler.
		ssl: { rejectUnauthorized: false },
	};
}
