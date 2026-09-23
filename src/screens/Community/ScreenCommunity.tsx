import { CtaBand } from '@/components/sections/CtaBand';
import { Container } from '@/components/ui/Container';
import { InlineLink } from '@/components/ui/InlineLink';
import { SectionHeading } from '@/components/ui/SectionHeading';
import {
	COMMUNITY_POSTS,
	type CommunityPostCard,
} from '@/screens/Community/communityContent';
import { CommunityGroundRules } from '@/screens/Community/components/CommunityGroundRules';
import { CommunityJoinCard } from '@/screens/Community/components/CommunityJoinCard';
import { CommunityPosts } from '@/screens/Community/components/CommunityPosts';
import { CommunityShared } from '@/screens/Community/components/CommunityShared';
import type { CommunityContent } from '@/services/pageContentService';

type ScreenCommunityProps = {
	content: CommunityContent;
	posts?: CommunityPostCard[];
};

/**
 * The community page.
 *
 * The join card sits immediately under the intro rather than at the bottom:
 * this page has one job, and a visitor who is already convinced should not
 * have to scroll past four sections of persuasion to act. The argument for
 * joining comes after it, for everyone who is not.
 */
export function ScreenCommunity({
	content,
	posts = COMMUNITY_POSTS,
}: ScreenCommunityProps) {
	return (
		<>
			<Container className="flex flex-col gap-10 py-14 lg:py-20">
				<SectionHeading
					as="h1"
					eyebrow="Community"
					title={content.title}
					description={content.intro}
				/>
				<CommunityJoinCard />
			</Container>

			<section className="border-t border-line bg-surface-alt">
				<Container className="flex flex-col gap-10 py-16 lg:py-20">
					<SectionHeading
						eyebrow="What gets shared"
						title="Four things the group is genuinely good for."
					/>
					<CommunityShared items={content.shared} />
				</Container>
			</section>

			<Container className="flex flex-col gap-10 py-16 lg:py-20">
				<SectionHeading
					eyebrow="Ground rules"
					title="Three rules, and why each one exists."
					description={
						<>
							Short enough to read, and the reason it works. They are set by{' '}
							<InlineLink href="/about">
								the people who run the building
							</InlineLink>
							, not a management company.
						</>
					}
				/>
				<CommunityGroundRules rules={content.groundRules} />
			</Container>

			<CommunityPosts posts={posts} />

			<div className="pt-16 lg:pt-20">
				<CtaBand
					title="Want to live somewhere with this already running?"
					body="Tell us when you are looking to move in and we will call back. Nothing is paid on this website."
					source="community-closing"
				/>
			</div>
		</>
	);
}
