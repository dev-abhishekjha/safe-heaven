import { CtaBand } from '@/components/sections/CtaBand';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PropertyComparison } from '@/screens/Property/components/PropertyComparison';
import { PropertyGallery } from '@/screens/Property/components/PropertyGallery';
import { PropertyHouseRules } from '@/screens/Property/components/PropertyHouseRules';
import { PropertyInclusions } from '@/screens/Property/components/PropertyInclusions';
import { PropertyRoomBlock } from '@/screens/Property/components/PropertyRoomBlock';
import { GALLERY } from '@/screens/Property/propertyContent';
import type { PropertyContent } from '@/services/pageContentService';

/**
 * The property page.
 *
 * Runs in the order a decision gets made: what is the same about every room,
 * then each room in turn, then the three side by side for whoever is still
 * undecided, then the photos and the rules — the two things that answer "what
 * am I actually walking into".
 *
 * Room blocks carry `id={room.key}`, so the home page's room cards and the
 * enquiry popup can link straight to `/property#double`.
 */
export function ScreenProperty({ content }: { content: PropertyContent }) {
	return (
		<>
			<Container className="py-14 lg:py-20">
				<SectionHeading
					as="h1"
					eyebrow="Property"
					title="Pick the room that fits how you live."
					description="Every room is furnished and ready to move into, and every rent covers the same things — Wi-Fi, electricity, water and housekeeping. What changes is how much space you have to yourself. We share current rent and availability when you enquire, since both move through the year."
				/>
			</Container>

			<PropertyInclusions items={content.inclusions} />

			<Container className="flex flex-col gap-16 py-16 lg:gap-24 lg:py-20">
				{content.rooms.map((room, index) => (
					<PropertyRoomBlock
						key={room.key}
						room={room}
						reversed={index % 2 === 1}
					/>
				))}
			</Container>

			<section className="bg-surface-alt">
				<Container className="flex flex-col gap-10 py-16 lg:py-20">
					<SectionHeading
						eyebrow="Side by side"
						title="The three rooms compared."
						description="Same building, same inclusions, same rules. The difference is how many people you share a room with."
					/>
					<PropertyComparison rooms={content.rooms} />
				</Container>
			</section>

			<Container className="flex flex-col gap-10 py-16 lg:py-20">
				<SectionHeading
					eyebrow="Photos"
					title="Have a look around."
					description="Tap any photo to see it larger."
				/>
				<PropertyGallery items={GALLERY} />
			</Container>

			<section className="border-t border-line bg-surface-alt">
				<Container className="flex flex-col gap-10 py-16 lg:py-20">
					<SectionHeading
						eyebrow="House rules"
						title="What living here asks of you."
						description="Short, and worth reading before you move in rather than after."
					/>
					<PropertyHouseRules />
				</Container>
			</section>

			<div className="pt-16 lg:pt-20">
				<CtaBand
					title="Want to see a room in person?"
					body="Tell us which room you are interested in and when suits you. We will call back to arrange it. Nothing is paid on this website."
					source="property-closing"
				/>
			</div>
		</>
	);
}
