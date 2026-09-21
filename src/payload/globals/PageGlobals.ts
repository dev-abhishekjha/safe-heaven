import { admins, anyone } from '@/payload/access';
import { iconOptions } from '@/payload/fields/iconOptions';
import type { Field, GlobalConfig } from 'payload';

const pageAccess = { read: anyone, update: admins };

/**
 * Icon picker for the editable point lists.
 *
 * A FACTORY, not a shared object: Payload sanitises field configs in place, so
 * handing the same object to several globals mutates it more than once.
 */
const iconKey = (): Field => ({
	name: 'iconKey',
	type: 'select',
	required: true,
	defaultValue: 'check',
	options: iconOptions(),
});

/**
 * Home page copy.
 *
 * The claims in `trustPoints` are the ones flagged E15.1 — putting them in the
 * CMS rather than in the component means correcting them later is an edit, not
 * a code change, which is the difference between "we will fix it" and it
 * actually getting fixed.
 */
export const HomePage: GlobalConfig = {
	slug: 'home-page',
	label: 'Home page',
	admin: {
		group: 'Pages',
		description: 'Hero copy and the home page sections.',
	},
	access: pageAccess,
	fields: [
		{
			type: 'collapsible',
			label: 'Hero',
			fields: [
				{ name: 'eyebrow', type: 'text', required: true },
				{
					name: 'title',
					type: 'text',
					required: true,
					admin: {
						description: 'The single biggest line on the site. Keep it short.',
					},
				},
				{ name: 'subtitle', type: 'textarea', required: true },
				{ name: 'heroImage', type: 'upload', relationTo: 'media' },
			],
		},
		{
			name: 'trustPoints',
			type: 'array',
			maxRows: 4,
			labels: { singular: 'Point', plural: 'Points' },
			admin: { description: 'The short list under the hero buttons.' },
			fields: [
				iconKey(),
				{
					name: 'lead',
					type: 'text',
					admin: { description: 'Optional bold opening, e.g. "300 m".' },
				},
				{ name: 'text', type: 'text', required: true },
			],
		},
		{
			name: 'whyPoints',
			type: 'array',
			maxRows: 4,
			labels: { singular: 'Reason', plural: 'Reasons' },
			admin: { description: 'The "Why Safe Haven" band.' },
			fields: [
				iconKey(),
				{ name: 'title', type: 'text', required: true },
				{ name: 'body', type: 'textarea', required: true },
			],
		},
		{
			name: 'howItWorks',
			type: 'array',
			maxRows: 4,
			labels: { singular: 'Step', plural: 'Steps' },
			admin: { description: 'Numbered automatically in the order listed.' },
			fields: [
				{ name: 'title', type: 'text', required: true },
				{ name: 'body', type: 'textarea', required: true },
			],
		},
	],
};

/** About page — the story, the numbers, the values. */
export const AboutPage: GlobalConfig = {
	slug: 'about-page',
	label: 'About page',
	admin: { group: 'Pages' },
	access: pageAccess,
	fields: [
		{ name: 'title', type: 'text', required: true },
		{
			name: 'intro',
			type: 'textarea',
			required: true,
			admin: {
				description:
					'Why you started Safe Haven, in three or four sentences. This does more work than any feature list on the site.',
			},
		},
		{
			name: 'stats',
			type: 'array',
			maxRows: 3,
			labels: { singular: 'Number', plural: 'Numbers' },
			admin: {
				description:
					'Leave empty while the real numbers are small — the strip hides itself.',
			},
			fields: [
				{
					type: 'row',
					fields: [
						{
							name: 'value',
							type: 'text',
							required: true,
							admin: { width: '40%' },
						},
						{
							name: 'label',
							type: 'text',
							required: true,
							admin: { width: '60%' },
						},
					],
				},
			],
		},
		{
			name: 'values',
			type: 'array',
			maxRows: 4,
			labels: { singular: 'Value', plural: 'Values' },
			fields: [
				iconKey(),
				{ name: 'title', type: 'text', required: true },
				{ name: 'body', type: 'textarea', required: true },
			],
		},
	],
};

/** Community page — the WhatsApp group and what circulates in it. */
export const CommunityPage: GlobalConfig = {
	slug: 'community-page',
	label: 'Community page',
	admin: { group: 'Pages' },
	access: pageAccess,
	fields: [
		{ name: 'title', type: 'text', required: true },
		{ name: 'intro', type: 'textarea', required: true },
		{
			name: 'joinNote',
			type: 'text',
			admin: {
				description:
					'Small print under the join button, e.g. "Free · leave any time".',
			},
		},
		{
			name: 'whatGetsShared',
			type: 'array',
			maxRows: 6,
			labels: { singular: 'Category', plural: 'Categories' },
			admin: { description: 'What circulates in the group.' },
			fields: [
				iconKey(),
				{ name: 'title', type: 'text', required: true },
				{ name: 'body', type: 'textarea', required: true },
			],
		},
		{
			name: 'groundRules',
			type: 'array',
			maxRows: 5,
			labels: { singular: 'Rule', plural: 'Rules' },
			fields: [
				{ name: 'title', type: 'text', required: true },
				{ name: 'body', type: 'textarea', required: true },
			],
		},
	],
};
