/**
 * Fill the CMS with the content the site currently hardcodes.
 *
 *   npx payload run scripts/seed.ts
 *
 * Re-runnable. Every write looks the row up first and updates it rather than
 * inserting a second copy, so running this twice is a no-op and running it
 * after you have edited something in the admin panel will OVERWRITE that edit.
 * It is a starting point, not a sync.
 *
 * Two things are deliberately NOT seeded:
 *
 *   - The About page. Its `intro` is the origin story, which is required and
 *     which only you can write (E15.6). Seeding a placeholder there would put
 *     invented words on the page looking finished; leaving it empty keeps the
 *     loud "not written yet" block visible instead.
 *   - Unconfirmed FAQ answers. The CMS has no "needs checking" flag, so an
 *     unconfirmed answer seeded into it silently becomes a published one. Only
 *     the seven answers that restate rules the site already keeps are seeded;
 *     the rest are printed at the end for you to write (E15.8).
 *
 * The run ends by counting every collection it touched and printing the
 * totals, so "it printed nothing" can never again be indistinguishable from
 * "it did nothing".
 */
import config from '@payload-config';
import { getPayload } from 'payload';

import { NEARBY, NEARBY_ORDER } from '../src/content/places';
import { RENT_INCLUSIONS, ROOMS } from '../src/content/rooms';
import {
	GROUND_RULES,
	WHAT_GETS_SHARED,
} from '../src/screens/Community/communityContent';
import { FAQS } from '../src/screens/Faq/faqContent';
import {
	BOOKING_STEPS,
	COMMUNITY_HIGHLIGHTS,
	TRUST_POINTS,
	WHY_POINTS,
} from '../src/screens/Home/homeContent';
import { HOUSE_RULES } from '../src/screens/Property/propertyContent';
import { ADDRESS, CHAT, COMMUNITY, CONTACT } from '../src/utils/SiteConfig';

/** Minimal Lexical document — one paragraph per string. */
function richText(paragraphs: string[]) {
	return {
		root: {
			type: 'root',
			format: '' as const,
			indent: 0,
			version: 1,
			direction: 'ltr' as const,
			children: paragraphs.map((text) => ({
				type: 'paragraph',
				format: '' as const,
				indent: 0,
				version: 1,
				direction: 'ltr' as const,
				children: [
					{
						type: 'text',
						text,
						detail: 0,
						format: 0,
						mode: 'normal',
						style: '',
						version: 1,
					},
				],
			})),
		},
	};
}

const log = (...args: unknown[]) => process.stdout.write(`${args.join(' ')}\n`);

async function main() {
	const payload = await getPayload({ config });

	/** Update the row matching `where`, or create it. Never duplicates. */
	async function upsert(
		collection: Parameters<typeof payload.find>[0]['collection'],
		where: Record<string, unknown>,
		data: Record<string, unknown>,
	) {
		const existing = await payload.find({
			collection,
			where: where as never,
			limit: 1,
		});
		if (existing.docs[0]) {
			return payload.update({
				collection,
				id: existing.docs[0].id,
				data: data as never,
			});
		}
		return payload.create({ collection, data: data as never });
	}

	// ---------------------------------------------------------------- settings
	await payload.updateGlobal({
		slug: 'site-settings',
		data: {
			phoneDisplay: CONTACT.phoneDisplay,
			phoneDigits: CONTACT.phoneHref.replace('tel:+', ''),
			email: CONTACT.email,
			chatNumber: CHAT.number,
			chatCommunityUrl: COMMUNITY.inviteUrl ?? undefined,
			addressLine1: ADDRESS.line1,
			addressLine2: ADDRESS.line2,
			visitingHours: CONTACT.visitingHours,
		} as never,
	});
	log('✓ site settings');

	// -------------------------------------------------------------- amenities
	for (const [index, item] of RENT_INCLUSIONS.entries()) {
		await upsert(
			'amenities',
			{ name: { equals: item.label } },
			{
				name: item.label,
				category: 'services',
				iconKey: item.icon,
				displayOrder: index,
			},
		);
	}
	log(`✓ ${RENT_INCLUSIONS.length} amenities`);

	// --------------------------------------------------------- nearby places
	let placeCount = 0;
	for (const category of NEARBY_ORDER) {
		for (const [index, place] of NEARBY[category].entries()) {
			await upsert(
				'nearby-places',
				{ name: { equals: place.name } },
				{
					name: place.name,
					category,
					distance: place.distance,
					note: place.note,
					highlight: Boolean(place.highlight),
					displayOrder: index,
				},
			);
			placeCount += 1;
		}
	}
	log(`✓ ${placeCount} nearby places`);

	// ---------------------------------------------------------------- property
	const property = await upsert(
		'properties',
		{ slug: { equals: 'safe-haven' } },
		{
			name: 'Safe Heaven Accomodations',
			slug: 'safe-haven',
			locality: ADDRESS.line1,
			addressLine: `${ADDRESS.line1}, ${ADDRESS.line2}`,
			shortDescription:
				'Boys-only PG in Greater Noida — furnished single, double and triple rooms, three minutes from Knowledge Park II Metro.',
			description: richText([
				'Every room is furnished and ready to move into, and every rent covers the same things — Wi-Fi, electricity, water and housekeeping. What changes is how much space you have to yourself.',
			]),
			houseRules: richText(
				HOUSE_RULES.map((rule) => `${rule.title}. ${rule.body}`),
			),
		},
	);
	log('✓ property');

	// -------------------------------------------------------------- room types
	for (const [index, room] of ROOMS.entries()) {
		await upsert(
			'room-types',
			{ slug: { equals: room.key } },
			{
				name: room.name,
				slug: room.key,
				property: property.id,
				occupancy: room.occupancy,
				availability: room.availability,
				summary: room.longBody,
				furnishings: room.inclusions.map((item) => ({ item })),
				displayOrder: index,
			},
		);
	}
	log(`✓ ${ROOMS.length} room types`);

	// --------------------------------------------------------------------- faqs
	const confirmed = FAQS.filter((faq) => faq.confirmed && faq.answer.trim());
	for (const [index, faq] of confirmed.entries()) {
		await upsert(
			'faqs',
			{ question: { equals: faq.question } },
			{
				question: faq.question,
				answer: richText([faq.answer]),
				category: faq.category,
				displayOrder: index,
			},
		);
	}
	log(`✓ ${confirmed.length} FAQs (confirmed answers only)`);

	// ------------------------------------------------------------- home globall
	await payload.updateGlobal({
		slug: 'home-page',
		data: {
			// NOT nested under `hero`. The admin groups these in a `collapsible`,
			// which is presentational only — collapsible has no `name`, so its
			// children are stored at the top level of the document. Nesting them
			// here would silently write a field that does not exist.
			eyebrow: 'Boys-only PG · Greater Noida',
			title: 'A safe, simple place to live while you study.',
			subtitle: `Furnished single, double and triple rooms at ${ADDRESS.line1} — a three-minute walk from Knowledge Park II Metro.`,
			trustPoints: TRUST_POINTS.map((point) => ({
				iconKey: point.icon,
				lead: point.lead,
				text: point.text,
			})),
			whyPoints: WHY_POINTS.map((point) => ({
				iconKey: point.icon,
				title: point.title,
				body: point.body,
			})),
			howItWorks: BOOKING_STEPS.map((step) => ({
				iconKey: step.icon,
				title: step.title,
				body: step.body,
			})),
		} as never,
	});
	log('✓ home page');

	// -------------------------------------------------------- community global
	await payload.updateGlobal({
		slug: 'community-page',
		data: {
			title: 'Where the useful stuff actually gets passed on.',
			intro:
				'Everyone here is a student at one of the colleges nearby, which means someone in the building has already done the internship you are applying for, taken the elective you are unsure about, or sold the cycle you need.',
			joinNote: COMMUNITY.note,
			whatGetsShared: WHAT_GETS_SHARED.map((item) => ({
				iconKey: item.icon,
				title: item.title,
				body: item.body,
			})),
			groundRules: GROUND_RULES.map((rule) => ({
				title: rule.title,
				body: rule.body,
			})),
		} as never,
	});
	log('✓ community page');

	// ------------------------------------------------------------------ report
	log('');
	log('Now in the database:');
	for (const collection of [
		'properties',
		'room-types',
		'amenities',
		'nearby-places',
		'faqs',
	] as const) {
		const { totalDocs } = await payload.count({ collection });
		log(`  ${String(totalDocs).padStart(3)}  ${collection}`);
	}

	const unconfirmed = FAQS.filter((faq) => !faq.confirmed);
	log('');
	log('Seeded. Still needs you:');
	log('  • About page — the origin story (E15.6). Not seeded on purpose.');
	log(`  • ${unconfirmed.length} FAQ answers (E15.8):`);
	for (const faq of unconfirmed) {
		log(`      - ${faq.question}`);
	}
	log(
		`  • ${COMMUNITY_HIGHLIGHTS.length} community highlights and all photos.`,
	);
	log('');

	// `process.exit` abandons anything still queued on stdout. Node only
	// guarantees a synchronous write when stdout is a TTY, and `payload run`
	// executes this in a child process with a pipe — so exiting here threw away
	// the entire report above and the run looked like it had done nothing.
	// Closing Payload first also lets the pool drain instead of being severed.
	await payload.destroy?.();
	await new Promise<void>((resolve) => {
		process.stdout.write('', () => resolve());
	});
	process.exit(0);
}

/**
 * TOP-LEVEL AWAIT, NOT `main().catch()`. This is load-bearing.
 *
 * `payload run` does, in payload/dist/bin/index.js:
 *
 *     const { payload } = await runBinScript({ args, script })  // -> await import(script)
 *     if (payload) { await payload.destroy() }
 *     process.exit(0)
 *
 * A floating `main()` lets module evaluation finish immediately, so the
 * dynamic import resolves, and `process.exit(0)` kills the process before the
 * first await inside main has come back. The run ends with status 0, no
 * output, and nothing written — which is precisely what happened twice, and
 * looks identical to a script that ran perfectly and had nothing to say.
 *
 * Awaiting at the top level keeps the module's evaluation pending until the
 * work is done, so the import cannot resolve early and the exit cannot
 * happen early.
 */
try {
	await main();
} catch (error) {
	process.stderr.write(
		`Seed failed: ${error instanceof Error ? error.message : String(error)}\n`,
	);
	process.exit(1);
}
