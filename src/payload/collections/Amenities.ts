import { admins, anyone } from '@/payload/access';
import type { CollectionConfig } from 'payload';

/**
 * The shared vocabulary of facilities.
 *
 * A collection rather than free text on each room so "Wi-Fi", "WiFi" and
 * "High-speed internet" cannot become three different amenities, and so each
 * one always draws the same icon.
 */
export const Amenities: CollectionConfig = {
	slug: 'amenities',
	admin: {
		group: 'Content',
		useAsTitle: 'name',
		defaultColumns: ['name', 'category', 'displayOrder'],
		description: 'Facilities that can be attached to the property or a room.',
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
			admin: {
				description: 'Shown exactly as typed, e.g. "High-speed Wi-Fi".',
			},
		},
		{
			name: 'category',
			type: 'select',
			required: true,
			defaultValue: 'building',
			options: [
				{ label: 'In the room', value: 'room' },
				{ label: 'In the building', value: 'building' },
				{ label: 'Services', value: 'services' },
				{ label: 'Safety', value: 'safety' },
			],
		},
		{
			name: 'iconKey',
			type: 'select',
			required: true,
			defaultValue: 'check',
			admin: {
				description: 'Which icon to draw. Names match the site’s icon set.',
			},
			options: [
				'check',
				'wifi',
				'power',
				'water',
				'housekeeping',
				'security',
				'securityCheck',
				'inclusive',
				'community',
				'metro',
				'campus',
				'hospital',
				'shopping',
				'clock',
			].map((value) => ({ label: value, value })),
		},
		{
			name: 'displayOrder',
			type: 'number',
			defaultValue: 0,
			admin: {
				description: 'Lower numbers appear first.',
				step: 1,
			},
		},
	],
};
