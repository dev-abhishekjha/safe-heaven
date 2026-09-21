/**
 * Tries BOTH Supabase poolers with the app's exact settings.
 *
 *   node --env-file=.env.local scripts/check-ports.mjs
 *
 * The point is to partition the problem. The build and the running site both
 * fail with "timeout exceeded when trying to connect" from Vercel. If this
 * succeeds from your machine, the database is fine and the difference is the
 * network path out of Vercel. If it fails here too, it is not a Vercel problem
 * at all and we have been looking in the wrong place.
 */
import net from 'node:net';
import pg from 'pg';

const url = new URL(process.env.DATABASE_URI || '');
const password = process.env.DATABASE_PASSWORD || '';
const user = decodeURIComponent(url.username);

/** Raw TCP first: separates "cannot reach the host" from "Postgres said no". */
function tcp(host, port) {
	return new Promise((resolve) => {
		const started = Date.now();
		const socket = net.createConnection({ host, port, timeout: 10000 });
		socket.on('connect', () => {
			socket.end();
			resolve(`open (${Date.now() - started}ms)`);
		});
		socket.on('timeout', () => {
			socket.destroy();
			resolve('TIMED OUT after 10s — packets going nowhere');
		});
		socket.on('error', (error) => resolve(`refused: ${error.message}`));
	});
}

async function postgres(host, port) {
	const client = new pg.Client({
		host,
		port,
		user,
		password,
		database: 'postgres',
		ssl: { rejectUnauthorized: false },
		connectionTimeoutMillis: 15000,
	});
	const started = Date.now();
	try {
		await client.connect();
		const { rows } = await client.query('select current_user, now()');
		await client.end();
		return `OK (${Date.now() - started}ms) as ${rows[0].current_user}`;
	} catch (error) {
		return `FAILED (${Date.now() - started}ms): ${error.message}${error.code ? ` [${error.code}]` : ''}`;
	}
}

const host = url.hostname;
process.stdout.write(`host: ${host}\nuser: ${user}\n\n`);

for (const port of [5432, 6543]) {
	const label = port === 5432 ? 'session pooler ' : 'transaction pool';
	process.stdout.write(`${label} :${port}\n`);
	process.stdout.write(`  tcp      ${await tcp(host, port)}\n`);
	process.stdout.write(`  postgres ${await postgres(host, port)}\n\n`);
}
