import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { InlineLink } from '@/components/ui/InlineLink';
import { Panel } from '@/components/ui/Panel';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FaqGroup } from '@/screens/Faq/components/FaqGroup';
import { FAQS, type FaqItem, groupFaqs } from '@/screens/Faq/faqContent';
import { CHAT, CONTACT } from '@/utils/SiteConfig';

const CHAT_MESSAGE =
	'Hi, I had a question about Safe Haven that the FAQ did not cover.';

type ScreenFaqProps = {
	faqs?: FaqItem[];
};

/**
 * The FAQ.
 *
 * Grouped rather than one long list, money questions first, and every panel
 * independently openable so answers can be compared. The card at the end
 * exists because the most useful thing an FAQ can do is admit when it has not
 * answered your question.
 */
export function ScreenFaq({ faqs = FAQS }: ScreenFaqProps = {}) {
	const groups = groupFaqs(faqs);

	return (
		<Container className="flex flex-col gap-12 py-14 lg:py-20">
			<SectionHeading
				as="h1"
				eyebrow="FAQ"
				title="The questions we get asked most."
				description={
					<>
						Rent, deposits, rules and moving in. If yours is not here,{' '}
						<InlineLink href="/contact">ask us directly</InlineLink> — it is a
						faster answer than reading. Most questions about space and
						furnishing are answered on the{' '}
						<InlineLink href="/property">room and property page</InlineLink>.
					</>
				}
			/>

			<div className="flex flex-col gap-10">
				{groups.map((group) => (
					<FaqGroup
						key={group.category}
						label={group.label}
						items={group.items}
					/>
				))}
			</div>

			<Panel className="flex flex-col items-start gap-4">
				<h2 className="font-display text-xl font-semibold text-ink">
					Still not answered?
				</h2>
				<p className="max-w-[52ch] text-sm leading-relaxed text-body">
					Ask us directly. Most questions take a minute on {CHAT.label} and we
					would rather you asked than guessed.
				</p>
				<div className="flex flex-col gap-3 sm:flex-row">
					<Button asChild variant="chat">
						<a
							href={CHAT.urlWithMessage(CHAT_MESSAGE)}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Icon name="chat" size={17} aria-hidden />
							Ask on {CHAT.label}
						</a>
					</Button>
					<Button asChild variant="secondary">
						<a href={CONTACT.phoneHref}>
							<Icon name="phone" size={17} aria-hidden />
							{CONTACT.phoneDisplay}
						</a>
					</Button>
				</div>
			</Panel>
		</Container>
	);
}
