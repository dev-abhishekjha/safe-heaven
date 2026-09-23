import { EnquiryButton } from '@/components/enquiry/EnquiryButton';
import { NavDrawer } from '@/components/layout/NavDrawer';
import { NavLink } from '@/components/layout/NavLink';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import {
	CONTACT,
	NAV_ITEMS,
	SITE_LEGAL_NAME,
	SITE_NAME,
} from '@/utils/SiteConfig';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Sticky site header.
 *
 * A Server Component — only the two genuinely interactive pieces (active-link
 * detection and the mobile drawer) ship JavaScript. The sticky treatment is
 * pure CSS; a scroll listener to add a shadow would cost a client boundary
 * around the whole header for an effect nobody asked for.
 */
export function Header() {
	return (
		<header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur-sm">
			<Container className="flex items-center justify-between gap-6 py-3">
				<Link
					href="/"
					className="flex shrink-0 items-center gap-3"
					aria-label={`${SITE_LEGAL_NAME} — home`}
				>
					<Image
						src="/logo.png"
						alt=""
						width={40}
						height={40}
						// The wordmark beside it already names the business, so the
						// mark is decorative — an alt here would be read twice.
						priority
						className="size-10 shrink-0"
					/>
					<span className="flex flex-col gap-0.5">
						<span className="text-sm font-bold uppercase tracking-[0.14em] text-ink">
							{SITE_NAME}
						</span>
						<span className="hidden text-[9px] font-medium uppercase tracking-[0.22em] text-label sm:block">
							Accommodations
						</span>
					</span>
				</Link>

				<nav aria-label="Main" className="hidden items-center gap-8 md:flex">
					{NAV_ITEMS.map((item) => (
						<NavLink
							key={item.href}
							href={item.href}
							className="pb-1 text-sm font-medium text-body"
						>
							{item.label}
						</NavLink>
					))}
				</nav>

				<div className="flex shrink-0 items-center gap-3">
					<a
						href={CONTACT.phoneHref}
						className="hidden items-center gap-2 text-sm font-medium text-body transition-colors hover:text-ink lg:flex"
					>
						<Icon name="phone" size={15} />
						{CONTACT.phoneDisplay}
					</a>
					<EnquiryButton size="sm" className="hidden sm:inline-flex" />
					<NavDrawer />
				</div>
			</Container>
		</header>
	);
}
