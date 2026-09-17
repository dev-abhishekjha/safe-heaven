import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
import { buildConfig } from 'payload';
import sharp from 'sharp';
import { buildPoolConfig } from './payload/databaseConfig';

import { Amenities } from './payload/collections/Amenities';
import {
	CommunityPosts,
	Faqs,
	Founders,
	Testimonials,
} from './payload/collections/ContentCollections';
import { Leads } from './payload/collections/Leads';
import { Media } from './payload/collections/Media';
import { NearbyPlaces } from './payload/collections/NearbyPlaces';
import { Properties } from './payload/collections/Properties';
import { RoomTypes } from './payload/collections/RoomTypes';
import { Users } from './payload/collections/Users';
import {
	AboutPage,
	CommunityPage,
	HomePage,
} from './payload/globals/PageGlobals';
import { SiteSettings } from './payload/globals/SiteSettings';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
	admin: {
		user: Users.slug,
		meta: {
			titleSuffix: ' — Safe Heaven Admin',
		},
	},
	collections: [
		Properties,
		RoomTypes,
		Amenities,
		NearbyPlaces,
		Testimonials,
		Faqs,
		CommunityPosts,
		Founders,
		Media,
		Leads,
		Users,
	],
	globals: [SiteSettings, HomePage, AboutPage, CommunityPage],
	editor: lexicalEditor(),
	secret: process.env.PAYLOAD_SECRET || '',
	typescript: {
		outputFile: path.resolve(dirname, 'payload-types.ts'),
	},
	/**
	 * Media storage.
	 *
	 * Gated on S3_BUCKET being set, deliberately. Without credentials Payload
	 * falls back to writing uploads to local disk, which is what you want on a
	 * laptop and fatal on Vercel — but a half-configured adapter that throws at
	 * boot is worse than either, because it takes the whole admin panel down
	 * rather than just the uploads.
	 *
	 * `forcePathStyle: true` is not optional with Supabase. Supabase's S3
	 * endpoint does not support virtual-hosted-style addressing
	 * (bucket.endpoint/key), only path style (endpoint/bucket/key). Without this
	 * flag the SDK builds the wrong URL and uploads fail with errors that point
	 * nowhere near the cause.
	 */
	plugins: process.env.S3_BUCKET
		? [
				s3Storage({
					collections: { media: true },
					bucket: process.env.S3_BUCKET,
					config: {
						endpoint: process.env.S3_ENDPOINT,
						region: process.env.S3_REGION,
						credentials: {
							accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
							secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
						},
						forcePathStyle: true,
					},
				}),
			]
		: [],
	db: postgresAdapter({
		// Discrete fields, not a connection string — see buildPoolConfig for why
		// passing both silently ignores DATABASE_PASSWORD.
		pool: buildPoolConfig(),
		migrationDir: path.resolve(dirname, 'migrations'),
		/**
		 * Schema push is a development convenience: it diffs the config against
		 * the database and alters tables to match, with no record of what it did.
		 * That is fine on a laptop and unacceptable in production, where an
		 * unreviewed ALTER against live data is how a column of enquiries
		 * disappears. Production runs migrations instead.
		 */
		push: process.env.NODE_ENV !== 'production',
	}),
	// Image resizing for uploads
	sharp,
});
