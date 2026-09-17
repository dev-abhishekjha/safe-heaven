import { admins, anyone } from '@/payload/access';
import type { CollectionConfig } from 'payload';

/**
 * Every enquiry from the site — the booking popup and the contact form.
 *
 * `create: anyone` is what lets a visitor submit without an account; read,
 * update and delete stay locked to admins, so a lead can be written but never
 * read back by the public. That asymmetry is the whole security model here,
 * and it is why this collection does not reuse the shared access defaults.
 *
 * Room type is stored as a plain value rather than a relationship on purpose:
 * a lead is a record of what someone asked for at a moment in time, and it
 * should not change or break if a room type is later renamed or removed.
 */
export const Leads: CollectionConfig = {
	slug: 'leads',
	labels: { singular: 'Enquiry', plural: 'Enquiries' },
	admin: {
		group: 'Enquiries',
		useAsTitle: 'fullName',
		// The columns someone actually triages on: who, how to reach them, what
		// they want, where they are in the process, and how stale it is.
		defaultColumns: [
			'fullName',
			'phone',
			'type',
			'roomType',
			'status',
			'createdAt',
		],
		// Search covers the fields you would have in your head when you go
		// looking — a name someone mentioned, or a number on a missed call.
		listSearchableFields: ['fullName', 'phone', 'email', 'message'],
		description:
			'Enquiries from the website, newest first. Use Filters to narrow by status — start with "New".',
		pagination: { defaultLimit: 25 },
	},
	access: {
		create: anyone,
		read: admins,
		update: admins,
		delete: admins,
	},
	defaultSort: '-createdAt',
	fields: [
		{
			type: 'row',
			fields: [
				{
					name: 'type',
					type: 'select',
					required: true,
					defaultValue: 'booking',
					admin: { width: '50%' },
					options: [
						{ label: 'Booking enquiry', value: 'booking' },
						{ label: 'Contact form', value: 'contact' },
					],
				},
				{
					name: 'status',
					type: 'select',
					required: true,
					defaultValue: 'new',
					admin: {
						width: '50%',
						description: 'Update as you work through it.',
					},
					options: [
						{ label: 'New', value: 'new' },
						{ label: 'Contacted', value: 'contacted' },
						{ label: 'Visit booked', value: 'visit-booked' },
						{ label: 'Moved in', value: 'converted' },
						{ label: 'Not proceeding', value: 'lost' },
					],
				},
			],
		},
		{
			type: 'row',
			fields: [
				{
					name: 'fullName',
					type: 'text',
					required: true,
					admin: { width: '50%' },
				},
				{
					name: 'phone',
					type: 'text',
					required: true,
					index: true,
					admin: { width: '50%', description: 'Ten digits, without +91.' },
				},
			],
		},
		{
			type: 'row',
			fields: [
				{ name: 'email', type: 'email', admin: { width: '50%' } },
				{
					name: 'roomType',
					type: 'select',
					admin: { width: '50%' },
					options: [
						{ label: 'Single', value: 'single' },
						{ label: 'Double', value: 'double' },
						{ label: 'Triple', value: 'triple' },
						{ label: 'Not sure yet', value: 'unsure' },
					],
				},
			],
		},
		{
			type: 'row',
			fields: [
				{
					name: 'moveInMonth',
					type: 'text',
					admin: { width: '50%', description: 'As submitted, e.g. "2026-07".' },
				},
				{
					name: 'subject',
					type: 'select',
					admin: {
						width: '50%',
						description: 'Contact form only.',
						condition: (data) => data?.type === 'contact',
					},
					options: [
						{ label: 'Booking a room', value: 'booking' },
						{ label: 'Visiting the property', value: 'visit' },
						{ label: 'Parent enquiry', value: 'parent' },
						{ label: 'Something else', value: 'other' },
					],
				},
			],
		},
		{ name: 'message', type: 'textarea' },
		{
			name: 'source',
			type: 'text',
			admin: {
				readOnly: true,
				description: 'Which page the enquiry came from. Set automatically.',
			},
		},
		{
			name: 'internalNotes',
			type: 'textarea',
			admin: { description: 'Your notes. Never shown to the enquirer.' },
		},
	],
};
