/**
 * FAQ content — PLACEHOLDER SEED, shaped to the `faqs` collection.
 *
 * Every item carries `confirmed`. It is the most important field here.
 *
 * `confirmed: true` means the answer restates something the site already
 * commits to — no online payment, boys-only, rent shared on enquiry — so it is
 * true by construction and I can write it. `confirmed: false` means the answer
 * depends on a fact about your building that I do not have: it renders with a
 * loud marker, and it is deliberately EXCLUDED from the FAQPage structured
 * data, because telling Google a deposit is "two months" when nobody has said
 * so is how a wrong answer ends up quoted in a search result.
 *
 * Filling these in is E15.8.
 */

export type FaqCategory =
	| 'rent'
	| 'rooms'
	| 'moving'
	| 'rules'
	| 'food'
	| 'general';

export type FaqItem = {
	id: string;
	category: FaqCategory;
	question: string;
	answer: string;
	/** False = drafted from a guess, must not ship and must not be published as JSON-LD. */
	confirmed: boolean;
};

export const FAQ_CATEGORY_LABELS: Record<FaqCategory, string> = {
	rent: 'Rent and deposit',
	rooms: 'Rooms and facilities',
	moving: 'Moving in and out',
	rules: 'Rules and visitors',
	food: 'Food',
	general: 'General',
};

/** Order the categories appear in — the money questions first. */
export const FAQ_CATEGORY_ORDER: FaqCategory[] = [
	'rent',
	'rooms',
	'moving',
	'rules',
	'food',
	'general',
];

export const FAQS: FaqItem[] = [
	{
		id: 'rent-amount',
		category: 'rent',
		question: 'How much is the rent?',
		answer:
			'We share it when you enquire rather than publishing it. Rent differs by room type and moves through the year with availability, and a number on a page goes stale within a month. Call or send an enquiry and you will get the current figure for the room you actually want.',
		confirmed: true,
	},
	{
		id: 'rent-included',
		category: 'rent',
		question: 'What does the rent include?',
		answer:
			'Wi-Fi, electricity, water and housekeeping of the common areas. There is no separate meter reading and no bill at the end of the month.',
		confirmed: false,
	},
	{
		id: 'rent-deposit',
		category: 'rent',
		question: 'Is there a security deposit, and is it refundable?',
		answer: '',
		confirmed: false,
	},
	{
		id: 'rooms-types',
		category: 'rooms',
		question: 'What kinds of room are there?',
		answer:
			'Single, double sharing and triple sharing. All three are furnished and ready to move into, and all three include the same things in the rent — what changes is how many people share the room.',
		confirmed: true,
	},
	{
		id: 'rooms-furnished',
		category: 'rooms',
		question: 'Is the room furnished?',
		answer:
			'Yes — a bed and mattress, a study desk and chair, and wardrobe or storage space for each resident.',
		confirmed: false,
	},
	{
		id: 'moving-book',
		category: 'moving',
		question: 'How do I book a room?',
		answer:
			'Send an enquiry with your name, phone number and roughly when you want to move in. We call you back, answer your questions and arrange a visit if you want one. Anything you agree is agreed with a person, on WhatsApp or at the building — nothing is ever paid on this website.',
		confirmed: true,
	},
	{
		id: 'moving-visit',
		category: 'moving',
		question: 'Can I see the place before I decide?',
		answer:
			'Yes, and we would rather you did. Come during visiting hours, or call ahead and we will keep someone free to show you around properly.',
		confirmed: true,
	},
	{
		id: 'moving-notice',
		category: 'moving',
		question: 'What notice do I have to give before leaving?',
		answer: '',
		confirmed: false,
	},
	{
		id: 'rules-boys',
		category: 'rules',
		question: 'Is this boys only?',
		answer:
			'Yes. Safe Haven is a boys-only PG. That is what the building is rather than a rule layered on top of it.',
		confirmed: true,
	},
	{
		id: 'rules-visitors',
		category: 'rules',
		question: 'Can I have visitors?',
		answer:
			'Visitors are welcome in the common areas during the day. Anyone staying overnight needs to be cleared first.',
		confirmed: false,
	},
	{
		id: 'rules-timing',
		category: 'rules',
		question: 'Is there a gate timing or curfew?',
		answer: '',
		confirmed: false,
	},
	{
		id: 'food-mess',
		category: 'food',
		question: 'Is food or a mess included?',
		answer: '',
		confirmed: false,
	},
	{
		id: 'general-payment',
		category: 'general',
		question: 'Do I pay anything on this website?',
		answer:
			'No. There is no payment form anywhere on this site and there never will be. If a page ever asks you to pay online, it is not us.',
		confirmed: true,
	},
	{
		id: 'general-who',
		category: 'general',
		question: 'Who will I be dealing with?',
		answer:
			'The people who run the building. Not a call centre and not a listing platform — whoever answers the phone is the same person you will meet when you visit.',
		confirmed: true,
	},
];

/** Grouped for rendering, preserving category order and dropping empty groups. */
export function groupFaqs(items: FaqItem[]) {
	return FAQ_CATEGORY_ORDER.map((category) => ({
		category,
		label: FAQ_CATEGORY_LABELS[category],
		items: items.filter((item) => item.category === category),
	})).filter((group) => group.items.length > 0);
}
