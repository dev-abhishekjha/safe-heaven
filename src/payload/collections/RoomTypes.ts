import { admins, adminsFieldLevel, anyone } from '@/payload/access';
import type { CollectionConfig } from 'payload';

/**
 * Single, double and triple sharing.
 *
 * Rent lives here but is locked to the admin panel by FIELD-LEVEL access, not
 * by simply not rendering it. That distinction matters: a field the site never
 * renders is still served by the REST and GraphQL APIs, and this site publishes
 * no prices. `read: adminsFieldLevel` means the value is stripped from every
 * unauthenticated response, so the team can quote from it without it leaking.
 */
export const RoomTypes: CollectionConfig = {
	slug: 'room-types',
	labels: { singular: 'Room type', plural: 'Room types' },
	admin: {
		group: 'Content',
		useAsTitle: 'name',
		defaultColumns: ['name', 'availability', 'occupancy', 'displayOrder'],
		description:
			'The three room options. Change availability here to update the website.',
	},
	access: {
		read: anyone,
		create: admins,
		update: admins,
		delete: admins,
	},
	defaultSort: 'displayOrder',
	fields: [
		{
			name: 'name',
			type: 'text',
			required: true,
			admin: { description: 'e.g. "Single room", "Double sharing".' },
		},
		{
			name: 'slug',
			type: 'text',
			required: true,
			unique: true,
			index: true,
		},
		{
			name: 'property',
			type: 'relationship',
			relationTo: 'properties',
			required: true,
		},
		{
			type: 'row',
			fields: [
				{
					name: 'occupancy',
					type: 'number',
					required: true,
					min: 1,
					max: 6,
					admin: {
						width: '50%',
						description: 'How many people share the room.',
					},
				},
				{
					name: 'availability',
					type: 'select',
					required: true,
					defaultValue: 'available',
					admin: {
						width: '50%',
						description: 'Drives the badge on the website.',
					},
					options: [
						{ label: 'Available', value: 'available' },
						{ label: 'Few beds left', value: 'limited' },
						{ label: 'Sold out', value: 'unavailable' },
					],
				},
			],
		},
		{
			name: 'summary',
			type: 'textarea',
			required: true,
			admin: {
				description: 'One or two sentences describing who the room suits.',
			},
		},
		{
			name: 'furnishings',
			type: 'array',
			labels: { singular: 'Item', plural: 'Items' },
			admin: {
				description: 'What comes with the room, e.g. "Study table and chair".',
			},
			fields: [{ name: 'item', type: 'text', required: true }],
		},
		{
			name: 'images',
			type: 'array',
			labels: { singular: 'Photo', plural: 'Photos' },
			fields: [
				{ name: 'image', type: 'upload', relationTo: 'media', required: true },
			],
		},
		{
			name: 'displayOrder',
			type: 'number',
			defaultValue: 0,
			admin: { description: 'Lower numbers appear first.' },
		},
		{
			type: 'collapsible',
			label: 'Internal — never shown on the website',
			admin: {
				description:
					'For the team when answering an enquiry. These values are stripped from every public API response.',
			},
			fields: [
				{
					type: 'row',
					fields: [
						{
							name: 'monthlyRent',
							type: 'number',
							access: { read: adminsFieldLevel },
							admin: { width: '50%', description: 'Rupees per month.' },
						},
						{
							name: 'securityDeposit',
							type: 'number',
							access: { read: adminsFieldLevel },
							admin: { width: '50%', description: 'Rupees, refundable.' },
						},
					],
				},
				{
					name: 'internalNotes',
					type: 'textarea',
					access: { read: adminsFieldLevel },
				},
			],
		},
	],
};
