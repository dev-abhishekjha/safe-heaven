import { admins, anyone } from '@/payload/access';
import type { GlobalConfig } from 'payload';

/**
 * Contact details, messaging links and social handles.
 *
 * This replaces `src/utils/SiteConfig.ts` — once the site reads from here,
 * changing the phone number is an edit in the admin panel rather than a
 * deploy. The current values there are the defaults to seed with.
 */
export const SiteSettings: GlobalConfig = {
	slug: 'site-settings',
	label: 'Site settings',
	admin: {
		group: 'Settings',
		description:
			'Phone, email, WhatsApp and address used across the whole site.',
	},
	access: { read: anyone, update: admins },
	fields: [
		{
			type: 'row',
			fields: [
				{
					name: 'phoneDisplay',
					type: 'text',
					required: true,
					admin: {
						width: '50%',
						description: 'As shown, e.g. "+91 82734 58926".',
					},
				},
				{
					name: 'phoneDigits',
					type: 'text',
					required: true,
					admin: {
						width: '50%',
						description:
							'Digits only with country code, for the dial link: 918273458926',
					},
				},
			],
		},
		{ name: 'email', type: 'email', required: true },
		{
			type: 'collapsible',
			label: 'Messaging',
			fields: [
				{
					name: 'chatNumber',
					type: 'text',
					required: true,
					admin: {
						description: 'WhatsApp number, digits only with country code.',
					},
				},
				{
					name: 'chatCommunityUrl',
					type: 'text',
					admin: {
						description:
							'Invite link for the WhatsApp community group. Powers the Community page — leave empty and that button stays hidden.',
					},
				},
			],
		},
		{
			type: 'collapsible',
			label: 'Address & hours',
			fields: [
				{ name: 'addressLine1', type: 'text', required: true },
				{ name: 'addressLine2', type: 'text', required: true },
				{
					name: 'visitingHours',
					type: 'text',
					required: true,
					admin: { description: 'e.g. "9 am – 8 pm, daily".' },
				},
			],
		},
		{
			name: 'socialLinks',
			type: 'array',
			labels: { singular: 'Link', plural: 'Links' },
			admin: {
				description:
					'Leave empty until the handles are live — the footer says "coming soon" when there are none.',
			},
			fields: [
				{
					type: 'row',
					fields: [
						{
							name: 'platform',
							type: 'select',
							required: true,
							admin: { width: '40%' },
							options: [
								{ label: 'Instagram', value: 'instagram' },
								{ label: 'Facebook', value: 'facebook' },
								{ label: 'LinkedIn', value: 'linkedin' },
								{ label: 'YouTube', value: 'youtube' },
							],
						},
						{
							name: 'url',
							type: 'text',
							required: true,
							admin: { width: '60%' },
						},
					],
				},
			],
		},
	],
};
