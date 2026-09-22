import { HomeClosingCta } from '@/screens/Home/components/HomeClosingCta';
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
 * (location), who says so (testimonials), and then the ask.
 *
 * The community block and the three-step "how it works" band were both cut
 * from this page. They are not deleted — `HomeCommunity` and
 * `HomeBookingSteps` still exist, and the Community page still carries that
 * material — so putting either back is one line.
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
			<HomeTestimonials items={content.testimonials} />
			<HomeClosingCta />
		</>
	);
}
