import { EnquiryButton } from '@/components/enquiry/EnquiryButton';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import type { SeedRoom } from '@/content/rooms';
import { cn } from '@/utils/UtilsClassName';

type PropertyRoomBlockProps = {
	room: SeedRoom;
	/** Odd blocks put the photo on the right, so the page alternates. */
	reversed?: boolean;
};

/**
 * One room, full width, photo on one side and the detail on the other.
 *
 * A block rather than a card because this is where someone decides: there is
 * room for the trade-off ("it is also the first to fill") that a card has to
 * leave out. The availability badge reads its tone straight from the room's
 * own `availability` value — the tones in `Badge` are named for what they
 * mean, so CMS data maps across with no lookup.
 */
export function PropertyRoomBlock({ room, reversed }: PropertyRoomBlockProps) {
	return (
		<article
			id={room.key}
			className="grid items-center gap-8 scroll-mt-24 lg:grid-cols-2 lg:gap-14"
		>
			<PlaceholderImage
				label={`Photo — ${room.name.toLowerCase()}`}
				className={cn('h-60 rounded-panel sm:h-80', reversed && 'lg:order-2')}
			/>

			<div className="flex flex-col gap-5">
				<div className="flex flex-wrap items-center gap-3">
					<span className="flex size-10 items-center justify-center rounded-pill bg-accent-tint text-accent">
						<Icon name={room.icon} size={19} aria-hidden />
					</span>
					<h3 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
						{room.name}
					</h3>
					<Badge tone={room.availability}>{room.availabilityLabel}</Badge>
				</div>

				<p className="text-sm font-medium text-muted">{room.occupancy}</p>

				<p className="max-w-[48ch] text-base leading-relaxed text-body">
					{room.longBody}
				</p>

				<ul className="flex flex-col gap-2.5 border-t border-line-soft pt-5">
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

				<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
					<EnquiryButton
						prefill={{ roomType: room.key, source: `property-${room.key}` }}
					>
						Ask about this room
					</EnquiryButton>
					<span className="text-sm text-muted">
						Rent and current availability shared on the call.
					</span>
				</div>
			</div>
		</article>
	);
}
