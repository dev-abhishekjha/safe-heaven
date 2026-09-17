import { EnquiryButton } from '@/components/enquiry/EnquiryButton';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { Panel } from '@/components/ui/Panel';
import { CONTACT } from '@/utils/SiteConfig';
import { cn } from '@/utils/UtilsClassName';

type CtaBandProps = {
	title: string;
	body: string;
	/** Recorded on the lead, so you can tell which page converts. */
	source: string;
	className?: string;
};

/**
 * The closing ask, shared by every page that has one.
 *
 * A component rather than a copy-paste because the phone number, the visiting
 * hours and the "nothing is paid on this website" promise have to be identical
 * everywhere they appear — six near-identical bands is how one of them ends up
 * still showing the old number after a change.
 */
export function CtaBand({ title, body, source, className }: CtaBandProps) {
	return (
		<Container className={cn('pb-16 lg:pb-20', className)}>
			<Panel
				tone="dark"
				className="flex flex-col items-center gap-7 px-6 py-12 text-center sm:px-10 lg:py-16"
			>
				<h2 className="max-w-[24ch] font-display text-3xl font-semibold text-balance sm:text-section">
					{title}
				</h2>

				<p className="max-w-[46ch] text-base leading-relaxed text-white/75">
					{body}
				</p>

				<div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
					<EnquiryButton size="lg" prefill={{ source }} />
					<Button
						asChild
						variant="ghost"
						size="lg"
						className="text-white hover:bg-white/10"
					>
						<a href={CONTACT.phoneHref}>
							<Icon name="phone" size={17} aria-hidden />
							{CONTACT.phoneDisplay}
						</a>
					</Button>
				</div>

				<p className="text-sm text-white/60">{CONTACT.visitingHours}</p>
			</Panel>
		</Container>
	);
}
