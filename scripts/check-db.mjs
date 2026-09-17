/**
 * Standalone database check.
 *
 *   node --env-file=.env.local scripts/check-db.mjs
 *
 * Deliberately does not import the Payload config: when `/admin` will not boot
 * you want to know whether the problem is the credentials or the app, and a
 * check that shares the app's imports cannot tell you that.
 */
import pg from 'pg';

const uri = process.env.DATABASE_URI || '';
const explicitPassword = process.env.DATABASE_PASSWORD || '';

if (!uri) {
	console.error('DATABASE_URI is not set. Is .env.local present?');
	process.exit(1);
}

const url = new URL(uri);
const password = explicitPassword || decodeURIComponent(url.password || '');
const mask = (value) =>
	value.length <= 4
		? '*'.repeat(value.length)
		: `${value.slice(0, 2)}${'*'.repeat(value.length - 4)}${value.slice(-2)}`;

console.log('host     :', url.hostname);
console.log('port     :', url.port || '5432');
console.log('user     :', decodeURIComponent(url.username));
console.log('database :', url.pathname.slice(1) || 'postgres');
console.log(
	'password :',
	`${mask(password)} (${password.length} chars, from ${
		explicitPassword ? 'DATABASE_PASSWORD' : 'the URI'
	})`,
);

if (explicitPassword && url.password) {
	const uriPassword = decodeURIComponent(url.password);
	if (uriPassword !== explicitPassword) {
		console.log(
			'\nnote     : the URI also contains a different password. It is ignored — DATABASE_PASSWORD wins.',
		);
	}
}

const client = new pg.Client({
	host: url.hostname,
	port: url.port ? Number(url.port) : 5432,
	user: decodeURIComponent(url.username),
	password,
	database: url.pathname.slice(1) || 'postgres',
	ssl: { rejectUnauthorized: false },
	connectionTimeoutMillis: 15000,
});

try {
	await client.connect();
	const { rows } = await client.query(
		"select current_user, current_database(), (select count(*) from information_schema.tables where table_schema = 'public') as public_tables",
	);
	const row = rows[0];
	console.log('\nconnected.');
	console.log('current_user  :', row.current_user);
	console.log('database      :', row.current_database);
	console.log('public tables :', row.public_tables);
	if (Number(row.public_tables) === 0) {
		console.log(
			'\nNo tables yet — start the app once and Payload will create them.',
		);
	}
	await client.end();
} catch (error) {
	console.error(`\nfailed — ${error.message}`);
	if (error.code === '28P01') {
		console.error(
			'Wrong password. Reset it in Supabase -> Project Settings -> Database -> Database password, then update DATABASE_PASSWORD.',
		);
	}
	if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
		console.error(
			'Hostname did not resolve — check the pooler host in DATABASE_URI.',
		);
	}
	process.exit(1);
}
