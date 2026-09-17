import { EnquiryButton } from '@/components/enquiry/EnquiryButton';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { SeedRoom } from '@/content/rooms';
import Link from 'next/link';

/**
 * Room preview.
 *
 * No rent appears on any card, and that is the product rule rather than
 * missing data: the number is shared on the call. Saying so on the card
 * itself — "Rent shared on enquiry" — is what stops it reading as an
 * oversight, and it gives the CTA a reason to exist.
 *
 * Each card's button pre-fills the popup with its own room type, so a visitor
 * who clicked "Single room" never has to answer that question again.
 */
export function HomeRooms({ rooms }: { rooms: SeedRoom[] }) {
	return (
		<section className="bg-surface-alt">
			<Container className="flex flex-col gap-10 py-16 lg:py-20">
				<SectionHeading
					eyebrow="Rooms"
					title="Three ways to live here."
					description="All furnished, all with the same inclusions. The difference is how many people share the room."
					action={
						<Button asChild variant="secondary">
							<Link href="/property">
								See all the details
								<Icon name="arrowRight" size={16} />
							</Link>
						</Button>
					}
				/>

				<ul className="grid gap-5 md:grid-cols-3 lg:gap-6">
					{rooms.map((room) => (
						<Card
							as="li"
							key={room.key}
							padded={false}
							className="flex flex-col"
						>
							<PlaceholderImage
								label={`Photo — ${room.name.toLowerCase()}`}
								className="h-44 rounded-none border-0 border-b border-dashed"
							/>

							<div className="flex flex-1 flex-col gap-4 p-6">
								<div className="flex items-start justify-between gap-3">
									<div className="flex flex-col gap-1">
										<h3 className="text-lg font-semibold text-ink">
											{room.name}
										</h3>
										<span className="text-sm text-muted">{room.occupancy}</span>
									</div>
									<Badge tone={room.availability}>
										{room.availabilityLabel}
									</Badge>
								</div>

								<p className="text-sm leading-relaxed text-body">
									{room.shortBody}
								</p>

								<ul className="flex flex-col gap-2">
									{room.inclusions.map((item) => (
										<li
											key={item}
											className="flex items-center gap-2.5 text-sm text-ink-soft"
										>
											<Icon
												name="check"
												size={15}
												className="shrink-0 text-ok"
												aria-hidden
											/>
											{item}
										</li>
									))}
								</ul>

								<div className="mt-auto flex flex-col gap-3 border-t border-line-soft pt-5">
									<span className="text-sm font-semibold text-ink">
										Rent shared on enquiry
									</span>
									<EnquiryButton
										className="w-full"
										prefill={{
											roomType: room.key,
											source: `home-room-${room.key}`,
										}}
									>
										Ask about this room
									</EnquiryButton>
								</div>
							</div>
						</Card>
					))}
				</ul>
			</Container>
		</section>
	);
}
