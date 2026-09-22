import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { MapEmbed } from '@/components/ui/MapEmbed';
import { Panel } from '@/components/ui/Panel';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ContactDetails } from '@/screens/Contact/components/ContactDetails';
import { ContactDistances } from '@/screens/Contact/components/ContactDistances';
import { ContactForm } from '@/screens/Contact/components/ContactForm';
import { ContactSocials } from '@/screens/Contact/components/ContactSocials';
import type { ContactContent } from '@/services/pageContentService';
import { CHAT } from '@/utils/SiteConfig';

const CHAT_MESSAGE =
	'Hi, I saw the Safe Haven website and wanted to ask a question.';

/**
 * Contact Us — contact and location merged, per the brief.
 *
 * The form and the details sit side by side rather than stacked, because the
 * two are alternatives: someone who wants to ring should not have to scroll
 * past a form to find the number, and someone who wants to write should not
 * have to scroll past an address to find the form.
 */
export function ScreenContact({ content }: { content: ContactContent }) {
	return (
		<>
			<Container className="flex flex-col gap-12 py-14 lg:py-20">
				<SectionHeading
					as="h1"
					eyebrow="Contact us"
					title="Ask us anything, or just come and see it."
					description="Call, message, or send this form — whichever suits you. Someone answers all three."
				/>

				<div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
					<div className="flex flex-col gap-8">
						<ContactForm />
					</div>

					<div className="flex flex-col gap-8">
						<ContactDetails />

						<Panel tone="chat" className="flex flex-col items-start gap-4">
							<div className="flex flex-col gap-1.5">
								<h2 className="text-lg font-semibold text-ink">
									{CHAT.label} is usually fastest
								</h2>
								<p className="max-w-[44ch] text-sm leading-relaxed text-body">
									Most questions get answered in a few minutes. No form, no
									waiting for a callback.
								</p>
							</div>
							<Button asChild variant="chat">
								<a
									href={CHAT.urlWithMessage(CHAT_MESSAGE)}
									target="_blank"
									rel="noopener noreferrer"
								>
									<Icon name="chat" size={17} aria-hidden />
									Message us on {CHAT.label}
								</a>
							</Button>
						</Panel>

						<div className="flex flex-col gap-3">
							<h2 className="text-xs uppercase tracking-[0.08em] text-label">
								Elsewhere
							</h2>
							<ContactSocials />
						</div>
					</div>
				</div>
			</Container>

			<section className="border-t border-line bg-surface-alt">
				<Container className="flex flex-col gap-10 py-16 lg:py-20">
					<SectionHeading
						eyebrow="Finding us"
						title="Where we are."
						description="Three minutes from Knowledge Park II Metro, on foot."
					/>
					<MapEmbed />
				</Container>
			</section>

			<Container className="flex flex-col gap-10 py-16 lg:py-20">
				<SectionHeading eyebrow="Nearby" title="What is around the building." />
				<ContactDistances nearby={content.nearby} />
			</Container>
		</>
	);
}
