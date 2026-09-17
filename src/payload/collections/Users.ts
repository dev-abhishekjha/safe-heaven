import type { CollectionConfig } from 'payload';

/**
 * Admin accounts for the Safe Heaven CMS.
 *
 * Single role for now (every user is a full admin) — see docs/PLAN.md.
 * Roles can be added later without a data migration.
 */
export const Users: CollectionConfig = {
	slug: 'users',
	auth: true,
	admin: {
		useAsTitle: 'email',
		group: 'System',
		defaultColumns: ['name', 'email', 'updatedAt'],
	},
	fields: [
		{
			name: 'name',
			type: 'text',
			required: true,
			admin: {
				description: 'Shown in the admin panel and on audit trails.',
			},
		},
	],
};
