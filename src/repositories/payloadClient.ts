import 'server-only';

import configPromise from '@payload-config';
import { getPayload } from 'payload';
import { cache } from 'react';

/**
 * The Payload client, memoised for the lifetime of a request.
 *
 * `server-only` at the top of this module is the guard that makes the layering
 * rule real: importing a repository into a Client Component becomes a build
 * error rather than a database connection string in the browser bundle.
 *
 * Queries go through Payload's LOCAL API — an in-process call straight to
 * Postgres, not an HTTP request to our own `/api` routes. Same process, no
 * network hop, no serialisation, and the access rules still apply.
 */
export const getPayloadClient = cache(async () => {
	return getPayload({ config: configPromise });
});
