import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import {
	ADDRESS,
	CONTACT,
	NAV_ITEMS,
	NEAREST_METRO,
	SITE_LEGAL_NAME,
	SITE_NAME,
} from '@/utils/SiteConfig';
import Link from 'next/link';

const PAGE_LINKS = NAV_ITEMS.filter((item) => item.href !== '/');

export function Footer() {
	return (
		<footer className="mt-auto border-t border-line bg-surface">
			<Container className="py-14">
				<div className="grid gap-10 border-b border-line pb-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
					<div className="flex flex-col gap-4">
						<div className="flex items-center gap-3">
							<span className="flex size-9 items-center justify-center rounded-field bg-accent-tint text-accent">
								<Icon name="home" size={20} />
							</span>
							<span className="text-[13px] font-bold uppercase tracking-[0.14em] text-ink">
								{SITE_NAME}
							</span>
						</div>
						<p className="max-w-[18rem] text-sm leading-relaxed text-muted">
							{ADDRESS.line1},
							<br />
							{ADDRESS.line2}
						</p>
						{/* Handles go live in E15.9 — saying so beats dead icons. */}
						<p className="text-xs text-label">Social links coming soon.</p>
					</div>

					<nav aria-label="Footer" className="flex flex-col gap-3">
						<h2 className="text-eyebrow uppercase text-label">Pages</h2>
						{PAGE_LINKS.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className="text-sm text-body transition-colors hover:text-ink"
							>
								{item.label}
							</Link>
						))}
					</nav>

					<div className="flex flex-col gap-3">
						<h2 className="text-eyebrow uppercase text-label">Contact</h2>
						<a
							href={CONTACT.phoneHref}
							className="text-sm text-body transition-colors hover:text-ink"
						>
							{CONTACT.phoneDisplay}
						</a>
						<a
							href={CONTACT.emailHref}
							className="break-all text-sm text-body transition-colors hover:text-ink"
						>
							{CONTACT.email}
						</a>
						<p className="text-sm text-body">Visits: {CONTACT.visitingHours}</p>
					</div>

					<div className="flex flex-col gap-3">
						<h2 className="text-eyebrow uppercase text-label">Nearest metro</h2>
						{NEAREST_METRO.map((stop) => (
							<p key={stop.name} className="text-sm text-body">
								{stop.name} — {stop.distance}
							</p>
						))}
					</div>
				</div>

				<div className="flex flex-col gap-2 pt-6 text-xs text-label sm:flex-row sm:items-center sm:justify-between">
					<p>
						© {new Date().getFullYear()} {SITE_LEGAL_NAME}
					</p>
					<p>Boys-only accommodation · Greater Noida</p>
				</div>
			</Container>
		</footer>
	);
}
