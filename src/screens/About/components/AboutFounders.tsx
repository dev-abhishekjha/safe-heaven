import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { MediaImage } from '@/components/ui/MediaImage';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import type { FounderCard } from '@/screens/About/aboutContent';

type AboutFoundersProps = {
	founders: FounderCard[];
};

/**
 * The people behind the building.
 *
 * When there are no founders yet this renders empty card skeletons rather than
 * hiding, which is the opposite of what the testimonials and stats sections
 * do. The distinction is what would be invented: a fake quote puts words in a
 * real person's mouth and a fake statistic is a false claim, but a card
 * reading "Name to be confirmed" states nothing untrue — it shows the shape
 * and marks the hole. Filling it is E15.5.
 */
export function AboutFounders({ founders }: AboutFoundersProps) {
	if (founders.length === 0) {
		return <FounderPlaceholders />;
	}

	return (
		<ul className="grid gap-6 sm:grid-cols-2">
			{founders.map((founder) => (
				<Card as="li" key={founder.id} padded={false} className="flex flex-col">
					{founder.photo ? (
						<MediaImage
							source={founder.photo}
							// Two columns from the `sm` breakpoint up, one below it.
							sizes="(min-width: 640px) 50vw, 100vw"
							// A portrait frame at the card's full width, anchored to the
							// top. A phone headshot is tall; the old fixed-height band was
							// landscape, so it took a strip out of the middle of the face.
							anchor="top"
							className="aspect-[4/5] w-full border-b border-line"
						/>
					) : (
						<PlaceholderImage
							label={`Photo — ${founder.name.toLowerCase()}`}
							className="h-56 rounded-none border-0 border-b border-dashed"
						/>
					)}
					<div className="flex flex-col gap-3 p-6 sm:p-7">
						<div className="flex flex-col gap-1">
							<h3 className="text-lg font-semibold text-ink">{founder.name}</h3>
							<span className="text-sm text-accent">{founder.role}</span>
						</div>
						<p className="text-sm leading-relaxed text-body">{founder.bio}</p>
						{founder.linkedinUrl ? (
							<a
								href={founder.linkedinUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="flex w-fit items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-accent"
							>
								LinkedIn
								<Icon name="arrowRight" size={14} aria-hidden />
							</a>
						) : null}
					</div>
				</Card>
			))}
		</ul>
	);
}

/** Two marked skeletons, so the section reviews as unfinished rather than absent. */
function FounderPlaceholders() {
	return (
		<ul className="grid gap-6 sm:grid-cols-2">
			{['first', 'second'].map((slot) => (
				<Card as="li" key={slot} padded={false} className="flex flex-col">
					<PlaceholderImage
						label="Photo — founder"
						className="h-56 rounded-none border-0 border-b border-dashed"
					/>
					<div className="flex flex-col gap-3 p-6 sm:p-7">
						<Badge tone="placeholder" className="w-fit">
							Awaiting details
						</Badge>
						<h3 className="text-lg font-semibold text-muted">
							Name to be confirmed
						</h3>
						<p className="text-sm leading-relaxed text-muted">
							Role, and two or three sentences: where they are from, what they
							did before this, and why student housing. This is the part parents
							read.
						</p>
					</div>
				</Card>
			))}
		</ul>
	);
}
