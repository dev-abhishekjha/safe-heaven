import { admins, anyone } from '@/payload/access';
import type { CollectionConfig } from 'payload';

/**
 * Campuses, metro stops, hospitals and markets, with distances.
 *
 * This is the site's strongest asset in data form — it answers the question a
 * parent is actually asking. Distance is stored as text ("3.5 km", "300 m")
 * rather than a number because the unit changes and the exact figure is
 * approximate either way; making it a number would invite false precision and
 * a conversion bug.
 */
export const NearbyPlaces: CollectionConfig = {
	slug: 'nearby-places',
	labels: { singular: 'Nearby place', plural: 'Nearby places' },
	admin: {
		group: 'Content',
		useAsTitle: 'name',
		defaultColumns: ['name', 'category', 'distance', 'displayOrder'],
		description:
			'Universities, metro stations, hospitals and markets shown on the home and contact pages.',
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
				description: 'Full name, e.g. "Galgotias College of Engineering".',
			},
		},
		{
			name: 'category',
			type: 'select',
			required: true,
			defaultValue: 'university',
			options: [
				{ label: 'University / college', value: 'university' },
				{ label: 'Metro', value: 'metro' },
				{ label: 'Hospital', value: 'hospital' },
				{ label: 'Shopping & markets', value: 'shopping' },
			],
		},
		{
			name: 'distance',
			type: 'text',
			required: true,
			admin: {
				description:
					'With the unit, exactly as it should read: "300 m", "3.5 km".',
			},
		},
		{
			name: 'note',
			type: 'text',
			admin: {
				description:
					'Optional qualifier, e.g. "About a three-minute walk". Shown under the name.',
			},
		},
		{
			name: 'highlight',
			type: 'checkbox',
			defaultValue: false,
			admin: {
				description:
					'Draws the distance in orange. Use sparingly — for the metro and the hospitals.',
			},
		},
		{
			name: 'displayOrder',
			type: 'number',
			defaultValue: 0,
			admin: {
				description: 'Lower numbers appear first, usually nearest first.',
			},
		},
	],
};
