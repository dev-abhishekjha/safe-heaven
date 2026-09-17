import { admins, anyone } from '@/payload/access';
import type { CollectionConfig } from 'payload';

/** 15 MB. Generous for a phone photo, tight enough to catch a mistake. */
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

/**
 * Every image on the site.
 *
 * `alt` is required at the schema level, not by convention — a photo cannot be
 * saved without describing it. That single constraint is what keeps the site
 * usable with a screen reader and readable to Google, and it is the only way
 * it survives contact with a busy person uploading twenty room photos.
 *
 * Files are written to disk until E4 swaps in the Supabase Storage adapter;
 * the adapter change needs no field changes.
 */
export const Media: CollectionConfig = {
	slug: 'media',
	admin: {
		group: 'Content',
		description:
			'Photos used across the site. Every upload needs a description.',
	},
	access: {
		read: anyone,
		create: admins,
		update: admins,
		delete: admins,
	},
	hooks: {
		beforeValidate: [
			({ req }) => {
				// A phone camera photo is 3–8 MB; anything past 15 MB is a
				// screenshot of a screenshot or a RAW file by mistake. Rejecting it
				// here is kinder than letting it upload slowly over a hotel wifi and
				// fail somewhere less legible.
				const file = req.file;
				if (file && file.size > MAX_UPLOAD_BYTES) {
					throw new Error(
						`That image is ${(file.size / 1024 / 1024).toFixed(1)} MB. Please keep uploads under ${MAX_UPLOAD_BYTES / 1024 / 1024} MB — resize it first, or export at a lower quality.`,
					);
				}
			},
		],
	},
	upload: {
		// An allowlist, not `image/*`. A browser will happily offer a 40 MB TIFF
		// or an SVG, and an SVG upload is a script-injection vector because it is
		// XML the browser executes.
		mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
		focalPoint: true,
		// One upload produces the original plus these four. That is deliberate:
		// the phone gets the 320px file, not the 1600px one, which is most of
		// why the site is fast on mobile data.
		//
		// Each derived size is re-encoded to WebP — roughly 30% smaller than
		// JPEG at the same quality. The ORIGINAL is left untouched in whatever
		// format it arrived, so the source file is never lost to a lossy
		// conversion. Only the derivatives, which can always be regenerated,
		// are compressed.
		imageSizes: [
			{
				name: 'thumb',
				width: 320,
				height: 240,
				position: 'centre',
				formatOptions: { format: 'webp', options: { quality: 78 } },
			},
			{
				name: 'card',
				width: 720,
				height: 540,
				position: 'centre',
				formatOptions: { format: 'webp', options: { quality: 80 } },
			},
			{
				name: 'hero',
				width: 1600,
				height: 1200,
				position: 'centre',
				formatOptions: { format: 'webp', options: { quality: 82 } },
			},
			{
				name: 'gallery',
				width: 1200,
				withoutEnlargement: true,
				formatOptions: { format: 'webp', options: { quality: 82 } },
			},
		],
	},
	fields: [
		{
			name: 'alt',
			type: 'text',
			required: true,
			admin: {
				description:
					'Describe what is in the photo, e.g. "Single room with study table by the window". Read aloud to visually impaired visitors and used by search engines.',
			},
		},
		{
			name: 'caption',
			type: 'text',
			admin: {
				description: 'Optional. Shown under the photo in galleries.',
			},
		},
	],
};
