/**
 * Public URLs for uploaded files.
 *
 * Why this exists: out of the box the storage adapter gives every upload a URL
 * on Payload's own route, `/api/media/file/<name>`. That route is a proxy —
 * each request boots Payload, runs the collection's read-access check against
 * the database, asks the bucket for the object and streams it back. The
 * functions run in iad1 while the database and the bucket are in Mumbai, so
 * that is several round trips across the world per photo. Measured on the live
 * site on 2026-09-26: 5.5 seconds to first byte for a single 30 KB hero image,
 * and `/_next/image` pays that whole chain again on every cache miss.
 *
 * Media is readable by `anyone`, so the access check was guarding nothing, and
 * the bucket is public. Linking straight to the bucket takes Payload out of the
 * image path entirely: the optimiser fetches the file from storage in a single
 * hop.
 *
 * The provider serves the S3 API and public reads from two different hosts —
 * `<ref>.storage.supabase.co/storage/v1/s3` for uploads, and
 * `<ref>.supabase.co/storage/v1/object/public/<bucket>/<key>` for reads. The
 * public one is derived from `S3_ENDPOINT` so there is no second env var to
 * forget. `next.config.ts` derives the same host for `remotePatterns`; change
 * the two together.
 */

/**
 * Base URL for public reads from the bucket, or `undefined` when storage is not
 * configured — the caller then leaves Payload's own file route in place, which
 * is slower but still works.
 */
export function getPublicBucketUrl(
	endpoint: string | undefined,
	bucket: string | undefined,
): string | undefined {
	if (!endpoint || !bucket) {
		return undefined;
	}

	let host: string;
	try {
		host = new URL(endpoint).hostname;
	} catch {
		return undefined;
	}

	const publicHost = host.replace('.storage.supabase.co', '.supabase.co');
	return `https://${publicHost}/storage/v1/object/public/${encodeURIComponent(bucket)}`;
}

/**
 * The public URL of one object.
 *
 * Each path segment is encoded on its own, the same way the adapter builds its
 * keys: phone uploads arrive with names like "WhatsApp Image 2026-09-22 at
 * 16.58.49.jpeg", and an unencoded space breaks the URL.
 */
export function buildPublicFileUrl(
	bucketUrl: string,
	filename: string,
	prefix?: string,
): string {
	const key = [prefix, filename]
		.flatMap((part) => (part ? part.split('/') : []))
		.filter(Boolean)
		.map(encodeURIComponent)
		.join('/');

	return `${bucketUrl}/${key}`;
}
