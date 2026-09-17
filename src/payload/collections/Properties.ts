import { admins, anyone } from '@/payload/access';
import type { CollectionConfig } from 'payload';

/**
 * The building.
 *
 * There is exactly one row today. It is a collection rather than a global on
 * purpose: a second property is a plausible next year, and adding a row costs
 * nothing, whereas migrating a global into a collection later would touch
 * every query on the site.
 */
export const Properties: CollectionConfig = {
	slug: 'properties',
	admin: {
		group: 'Content',
		useAsTitle: 'name',
		defaultColumns: ['name', 'locality', 'updatedAt'],
		description: 'The property itself — address, description and photos.',
	},
	access: {
		read: anyone,
		create: admins,
		update: admins,
		delete: admins,
	},
	fields: [
		{
			name: 'name',
			type: 'text',
			required: true,
			defaultValue: 'Safe Heaven Accomodations',
		},
		{
			name: 'slug',
			type: 'text',
			required: true,
			unique: true,
			index: true,
			admin: {
				description:
					'Used in the web address. Lower case, words separated by hyphens.',
			},
		},
		{
			type: 'row',
			fields: [
				{
					name: 'locality',
					type: 'text',
					required: true,
					admin: {
						width: '50%',
						description: 'e.g. "Mitra Enclave, Sector P7"',
					},
				},
				{
					name: 'city',
					type: 'text',
					required: true,
					defaultValue: 'Greater Noida',
					admin: { width: '50%' },
				},
			],
		},
		{
			name: 'addressLine',
			type: 'textarea',
			required: true,
			admin: {
				description: 'Full postal address, as it should appear in the footer.',
			},
		},
		{
			name: 'mapEmbedUrl',
			type: 'text',
			admin: {
				description:
					'Google Maps embed link. In Maps: Share → Embed a map → copy the src="…" value only.',
			},
		},
		{
			name: 'shortDescription',
			type: 'textarea',
			required: true,
			admin: {
				description:
					'One or two sentences. Used on the home page and in search results.',
			},
		},
		{
			name: 'description',
			type: 'richText',
			admin: { description: 'The longer write-up on the property page.' },
		},
		{
			name: 'heroImage',
			type: 'upload',
			relationTo: 'media',
			admin: { description: 'The main photo of the building.' },
		},
		{
			name: 'gallery',
			type: 'array',
			labels: { singular: 'Photo', plural: 'Photos' },
			admin: { description: 'Common areas, study room, kitchen, terrace.' },
			fields: [
				{ name: 'image', type: 'upload', relationTo: 'media', required: true },
			],
		},
		{
			name: 'amenities',
			type: 'relationship',
			relationTo: 'amenities',
			hasMany: true,
			admin: { description: 'Facilities available across the building.' },
		},
		{
			name: 'houseRules',
			type: 'richText',
			admin: {
				description: 'Visitor policy, timings, anything residents agree to.',
			},
		},
	],
};
