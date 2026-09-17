import { admins, anyone } from '@/payload/access';
import type { CollectionConfig } from 'payload';

/** Shared read/write rules for straightforward editorial content. */
const editorialAccess = {
	read: anyone,
	create: admins,
	update: admins,
	delete: admins,
};

/**
 * Resident quotes.
 *
 * `featured` rather than a hand-sorted list, so the home page can take the
 * best three without an editor maintaining a separate ordering.
 */
export const Testimonials: CollectionConfig = {
	slug: 'testimonials',
	admin: {
		group: 'Content',
		useAsTitle: 'name',
		defaultColumns: ['name', 'context', 'featured', 'displayOrder'],
		description:
			'Quotes from residents. Get written permission before publishing a name.',
	},
	access: editorialAccess,
	defaultSort: 'displayOrder',
	fields: [
		{ name: 'name', type: 'text', required: true },
		{
			name: 'context',
			type: 'text',
			admin: {
				description: 'College and year, or "Parent". Shown under the name.',
			},
		},
		{
			name: 'quote',
			type: 'textarea',
			required: true,
			admin: { description: 'Their words. Keep it to two or three sentences.' },
		},
		{ name: 'photo', type: 'upload', relationTo: 'media' },
		{
			name: 'featured',
			type: 'checkbox',
			defaultValue: false,
			admin: { description: 'Featured quotes appear on the home page.' },
		},
		{ name: 'displayOrder', type: 'number', defaultValue: 0 },
	],
};

/**
 * FAQ entries, grouped by category on the page.
 */
export const Faqs: CollectionConfig = {
	slug: 'faqs',
	labels: { singular: 'Question', plural: 'Questions' },
	admin: {
		group: 'Content',
		useAsTitle: 'question',
		defaultColumns: ['question', 'category', 'displayOrder'],
		description:
			'Answers shown on the FAQ page. Plain language beats policy language.',
	},
	access: editorialAccess,
	defaultSort: 'displayOrder',
	fields: [
		{ name: 'question', type: 'text', required: true },
		{ name: 'answer', type: 'richText', required: true },
		{
			name: 'category',
			type: 'select',
			required: true,
			defaultValue: 'general',
			options: [
				{ label: 'Rent & deposit', value: 'rent' },
				{ label: 'Rooms & facilities', value: 'rooms' },
				{ label: 'Moving in & out', value: 'moving' },
				{ label: 'Rules & visitors', value: 'rules' },
				{ label: 'Food', value: 'food' },
				{ label: 'General', value: 'general' },
			],
		},
		{ name: 'displayOrder', type: 'number', defaultValue: 0 },
	],
};

/**
 * Events and resident stories for the Community page.
 */
export const CommunityPosts: CollectionConfig = {
	slug: 'community-posts',
	labels: { singular: 'Community post', plural: 'Community posts' },
	admin: {
		group: 'Content',
		useAsTitle: 'title',
		defaultColumns: ['title', 'date'],
		description: 'Events, match nights, festivals — anything worth showing.',
	},
	access: editorialAccess,
	defaultSort: '-date',
	fields: [
		{ name: 'title', type: 'text', required: true },
		{
			name: 'date',
			type: 'date',
			required: true,
			admin: { date: { pickerAppearance: 'dayOnly' } },
		},
		{ name: 'excerpt', type: 'textarea' },
		{ name: 'coverImage', type: 'upload', relationTo: 'media' },
		{
			name: 'gallery',
			type: 'array',
			labels: { singular: 'Photo', plural: 'Photos' },
			fields: [
				{ name: 'image', type: 'upload', relationTo: 'media', required: true },
			],
		},
		{ name: 'body', type: 'richText' },
	],
};

/**
 * The people behind the building — the About page.
 */
export const Founders: CollectionConfig = {
	slug: 'founders',
	admin: {
		group: 'Content',
		useAsTitle: 'name',
		defaultColumns: ['name', 'role', 'displayOrder'],
		description: 'Shown on the About page.',
	},
	access: editorialAccess,
	defaultSort: 'displayOrder',
	fields: [
		{ name: 'name', type: 'text', required: true },
		{
			name: 'role',
			type: 'text',
			required: true,
			admin: { description: 'e.g. "Founder", "Operations".' },
		},
		{
			name: 'bio',
			type: 'textarea',
			required: true,
			admin: {
				description:
					'Two or three sentences — where they are from, what they did before, why student housing. This is the part parents read.',
			},
		},
		{ name: 'photo', type: 'upload', relationTo: 'media' },
		{
			type: 'row',
			fields: [
				{ name: 'linkedinUrl', type: 'text', admin: { width: '50%' } },
				{ name: 'email', type: 'email', admin: { width: '50%' } },
			],
		},
		{ name: 'displayOrder', type: 'number', defaultValue: 0 },
	],
};
