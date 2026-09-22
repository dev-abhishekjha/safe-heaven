import { EnquiryButton } from '@/components/enquiry/EnquiryButton';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { MediaImage } from '@/components/ui/MediaImage';
import type { MediaImageSource } from '@/components/ui/MediaImage';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { Eyebrow } from '@/components/ui/SectionHeading';
import { ADDRESS, CONTACT } from '@/utils/SiteConfig';

/**
 * The hero.
 *
 * One headline, one primary action, and the address — in that order, because
 * the visitor arriving from a search for "PG near Knowledge Park II" is
 * checking whether this is even in the right place before reading anything
 * else. The location card sits on the photo rather than below the fold for
 * the same reason.
 */
type HomeHeroProps = {
	eyebrow: string;
	title: string;
	subtitle: string;
	photo?: MediaImageSource;
};

export function HomeHero({ eyebrow, title, subtitle, photo }: HomeHeroProps) {
	return (
		<Container className="grid items-center gap-12 py-14 lg:grid-cols-2 lg:gap-16 lg:py-20">
			<div className="flex flex-col gap-7">
				<span className="inline-flex w-fit items-center gap-2 rounded-pill bg-accent-tint px-3.5 py-2 text-accent-hover">
					<span className="size-1.5 rounded-pill bg-accent" />
					<Eyebrow className="text-[11px] text-accent-hover">{eyebrow}</Eyebrow>
				</span>

				<h1 className="max-w-[18ch] font-display text-4xl font-semibold text-balance text-ink sm:text-display">
					{title}
				</h1>

				<p className="max-w-[46ch] text-base leading-relaxed text-body sm:text-[17px]">
					{subtitle}
				</p>

				<div className="flex flex-col gap-3 sm:flex-row">
					<EnquiryButton size="lg" prefill={{ source: 'home-hero' }} />
				</div>

				<p className="text-sm text-muted">
					Prefer to talk?{' '}
					<a
						href={CONTACT.phoneHref}
						className="font-semibold text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-action"
					>
						{CONTACT.phoneDisplay}
					</a>{' '}
					&middot; {CONTACT.visitingHours}
				</p>
			</div>

			<div className="relative">
				{photo ? (
					<MediaImage
						source={photo}
						// Above the fold, so it is the one image worth loading eagerly.
						priority
						sizes="(min-width: 1024px) 50vw, 100vw"
						className="h-72 rounded-panel sm:h-[26rem] lg:h-[32rem]"
					/>
				) : (
					<PlaceholderImage
						label="Photo — building exterior"
						className="h-72 rounded-panel sm:h-[26rem] lg:h-[32rem]"
					/>
				)}

				{/* Sits inside the photo on desktop, stacks beneath it on phones,
				    where an overlay would cover the only picture on the page. */}
				<div className="mt-4 flex items-start gap-3 rounded-card border border-line bg-surface p-4 shadow-sm sm:absolute sm:bottom-5 sm:left-5 sm:mt-0 sm:max-w-[19rem] sm:p-5">
					<Icon
						name="pin"
						size={20}
						className="mt-0.5 shrink-0 text-action"
						aria-hidden
					/>
					<div className="flex flex-col gap-1">
						<span className="text-sm font-semibold text-ink">
							{ADDRESS.line1}
						</span>
						<span className="text-sm text-body">{ADDRESS.line2}</span>
					</div>
				</div>
			</div>
		</Container>
	);
}
