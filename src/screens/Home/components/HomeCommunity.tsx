import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { Panel } from '@/components/ui/Panel';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { COMMUNITY_HIGHLIGHTS } from '@/screens/Home/homeContent';
import { CHAT } from '@/utils/SiteConfig';
import Link from 'next/link';

const CHAT_MESSAGE =
	'Hi, I saw the Safe Haven website and wanted to ask about a room.';

/**
 * Community teaser, with the WhatsApp band attached.
 *
 * The chat band is a `Panel tone="chat"` rather than a second primary button,
 * because messaging is a different kind of action from booking and should not
 * compete with it. Keeping the two visually distinct is the reason `chat` is
 * its own variant in the design system rather than a green override.
 */
export function HomeCommunity() {
	return (
		<Container className="flex flex-col gap-10 py-16 lg:py-20">
			<SectionHeading
				eyebrow="Community"
				title="You are moving in with people, not just into a room."
				description="Residents come from the colleges around here, so the person in the next room is probably on your commute."
			/>

			<div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
				<PlaceholderImage
					label="Photo — common room"
					className="h-60 rounded-panel lg:h-full lg:min-h-[20rem]"
				/>

				<div className="flex flex-col gap-5">
					<ul className="flex flex-col gap-4">
						{COMMUNITY_HIGHLIGHTS.map((highlight) => (
							<li key={highlight.text} className="flex items-start gap-3">
								<Icon
									name={highlight.icon}
									size={19}
									className="mt-0.5 shrink-0 text-accent"
									aria-hidden
								/>
								<span className="text-sm leading-relaxed text-ink-soft">
									{highlight.text}
								</span>
							</li>
						))}
					</ul>

					<Panel tone="chat" className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<h3 className="text-lg font-semibold text-ink">
								Ask the question you actually have.
							</h3>
							<p className="text-sm leading-relaxed text-body">
								{CHAT.label} is the fastest way to reach someone. No form, no
								wait for a callback.
							</p>
						</div>

						<div className="flex flex-col gap-3 sm:flex-row">
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
							<Button asChild variant="ghost">
								<Link href="/community">
									See life here
									<Icon name="arrowRight" size={16} aria-hidden />
								</Link>
							</Button>
						</div>
					</Panel>
				</div>
			</div>
		</Container>
	);
}
