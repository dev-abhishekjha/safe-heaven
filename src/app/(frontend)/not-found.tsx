import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { CONTACT } from '@/utils/SiteConfig';
import Link from 'next/link';

export default function NotFound() {
	return (
		<Container className="flex flex-col items-center gap-6 py-24 text-center lg:py-32">
			<span className="text-eyebrow uppercase text-accent">404</span>

			<h1 className="max-w-[20ch] font-display text-3xl font-semibold text-balance text-ink sm:text-section">
				That page isn&rsquo;t here.
			</h1>

			<p className="max-w-[46ch] text-base leading-relaxed text-body">
				The link may be old, or we may have moved something. The rooms, the
				location and the enquiry form are all still where you would expect.
			</p>

			<div className="flex flex-col gap-3 pt-2 sm:flex-row">
				<Button asChild size="lg">
					<Link href="/property">See the property</Link>
				</Button>
				<Button asChild variant="secondary" size="lg">
					<Link href="/">Back to the home page</Link>
				</Button>
			</div>

			<a
				href={CONTACT.phoneHref}
				className="flex items-center gap-2 pt-2 text-sm font-medium text-body transition-colors hover:text-ink"
			>
				<Icon name="phone" size={16} className="text-accent" />
				{CONTACT.phoneDisplay}
			</a>
		</Container>
	);
}
