import { CtaBand } from '@/components/sections/CtaBand';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { AboutFounders } from '@/screens/About/components/AboutFounders';
import { AboutOrigin } from '@/screens/About/components/AboutOrigin';
import { AboutStats } from '@/screens/About/components/AboutStats';
import { AboutValues } from '@/screens/About/components/AboutValues';
import type { AboutContent } from '@/services/pageContentService';

type ScreenAboutProps = {
	content: AboutContent;
};

/**
 * The About page.
 *
 * Two of its four sections are waiting on words only you can write, so this is
 * deliberately structure-first: the story slot and the founder cards render a
 * marked, unfinished state rather than a plausible invention. Everything that
 * can be true today — the values, which restate rules the site already keeps —
 * is finished.
 */
export function ScreenAbout({ content }: ScreenAboutProps) {
	return (
		<>
			<Container className="flex flex-col gap-10 py-14 lg:py-20">
				<SectionHeading
					as="h1"
					eyebrow="About us"
					title="Why we started Safe Haven."
					description="Our story, the people behind the building, and what we will not cut corners on."
				/>
				<AboutOrigin story={content.story} photo={content.originPhoto} />
			</Container>

			<AboutStats stats={content.stats} />

			<section className="border-t border-line bg-surface-alt">
				<Container className="flex flex-col gap-10 py-16 lg:py-20">
					<SectionHeading
						eyebrow="The people"
						title="Who actually runs this."
					/>
					<AboutFounders founders={content.founders} />
				</Container>
			</section>

			<Container className="flex flex-col gap-10 py-16 lg:py-20">
				<SectionHeading
					eyebrow="What we hold to"
					title="Three things you can hold us to."
					description="Each one is checkable against the rest of this site rather than a sentiment."
				/>
				<AboutValues values={content.values} />
			</Container>

			<CtaBand
				title="Come and meet us."
				body="Arrange a visit and see the place for yourself. Nothing is paid on this website."
				source="about-closing"
			/>
		</>
	);
}
