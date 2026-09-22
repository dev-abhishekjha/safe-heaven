import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { MediaImage } from '@/components/ui/MediaImage';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { CommunityPostCard } from '@/screens/Community/communityContent';

type CommunityPostsProps = {
	posts: CommunityPostCard[];
};

/** Indian English, and the year matters because posts are dated. */
const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString('en-IN', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});

/**
 * What the group has actually done — from the `community-posts` collection.
 *
 * Hidden entirely while nothing is published, for the same reason the
 * testimonials section is: a fabricated event reads exactly like a real one,
 * and the whole argument of this page is that the community is real.
 */
export function CommunityPosts({ posts }: CommunityPostsProps) {
	if (posts.length === 0) {
		return null;
	}

	return (
		<section className="bg-surface-alt">
			<Container className="flex flex-col gap-10 py-16 lg:py-20">
				<SectionHeading eyebrow="Lately" title="What has been happening." />

				<ul className="grid gap-5 md:grid-cols-3 lg:gap-6">
					{posts.map((post) => (
						<Card
							as="li"
							key={post.id}
							padded={false}
							className="flex flex-col"
						>
							{post.photo ? (
								<MediaImage
									source={post.photo}
									sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
									className="h-40 border-b border-line"
								/>
							) : (
								<PlaceholderImage
									label={`Photo — ${post.title.toLowerCase()}`}
									className="h-40 rounded-none border-0 border-b border-dashed"
								/>
							)}
							<div className="flex flex-1 flex-col gap-2.5 p-6">
								<time
									dateTime={post.date}
									className="text-xs uppercase tracking-[0.08em] text-label"
								>
									{formatDate(post.date)}
								</time>
								<h3 className="text-base font-semibold text-ink">
									{post.title}
								</h3>
								{post.excerpt ? (
									<p className="text-sm leading-relaxed text-body">
										{post.excerpt}
									</p>
								) : null}
							</div>
						</Card>
					))}
				</ul>
			</Container>
		</section>
	);
}
