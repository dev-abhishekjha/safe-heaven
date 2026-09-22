import { HomeBookingSteps } from '@/screens/Home/components/HomeBookingSteps';
import { HomeClosingCta } from '@/screens/Home/components/HomeClosingCta';
import { HomeCommunity } from '@/screens/Home/components/HomeCommunity';
import { HomeHero } from '@/screens/Home/components/HomeHero';
import { HomeLocation } from '@/screens/Home/components/HomeLocation';
import { HomeRooms } from '@/screens/Home/components/HomeRooms';
import { HomeTestimonials } from '@/screens/Home/components/HomeTestimonials';
import { HomeTrustStrip } from '@/screens/Home/components/HomeTrustStrip';
import { HomeWhy } from '@/screens/Home/components/HomeWhy';
import type { HomeContent } from '@/services/pageContentService';

/**
 * The home page.
 *
 * Order is the argument the page makes: what and where (hero), why you can
 * trust it (strip, why), what you would live in (rooms), where it sits
 * (location), who else is there (community), what happens next (steps), who
 * says so (testimonials), and then the ask.
 *
 * Takes everything as one `content` object and fetches nothing itself — the
 * route is the only layer allowed to touch a service, per AGENTS.md. That is
 * what lets this same screen render from the CMS, from seed content, or from a
 * fixture in a test without changing.
 */
export function ScreenHome({ content }: { content: HomeContent }) {
	return (
		<>
			<HomeHero
				eyebrow={content.eyebrow}
				title={content.title}
				subtitle={content.subtitle}
				photo={content.heroPhoto}
			/>
			<HomeTrustStrip points={content.trustPoints} />
			<HomeWhy points={content.whyPoints} />
			<HomeRooms rooms={content.rooms} />
			<HomeLocation nearby={content.nearby} />
			<HomeCommunity photo={content.communityPhoto} />
			<HomeBookingSteps steps={content.bookingSteps} />
			<HomeTestimonials items={content.testimonials} />
			<HomeClosingCta />
		</>
	);
}
