import { Icon } from '@/components/ui/Icon';
import { SOCIALS } from '@/utils/SiteConfig';

/**
 * Social links, when there are any.
 *
 * While the list is empty this says so in one quiet line instead of showing
 * greyed-out icons that go nowhere. A dead social icon is a small thing that
 * makes everything around it look unfinished.
 */
export function ContactSocials() {
	if (SOCIALS.length === 0) {
		return (
			<p className="text-sm text-muted">
				Social accounts are not live yet. The phone and {''}
				<span className="text-ink">WhatsApp</span> are the quickest ways to
				reach us.
			</p>
		);
	}

	return (
		<ul className="flex flex-wrap gap-3">
			{SOCIALS.map((social) => (
				<li key={social.label}>
					<a
						href={social.url}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-2 rounded-pill border border-line px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-slate-400"
					>
						{social.label}
						<Icon name="arrowRight" size={14} aria-hidden />
					</a>
				</li>
			))}
		</ul>
	);
}
