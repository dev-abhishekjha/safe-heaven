'use client';

import { NavLink } from '@/components/layout/NavLink';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { chatHref } from '@/utils/ChatMessage';
import { CHAT, CONTACT, NAV_ITEMS } from '@/utils/SiteConfig';
import * as Dialog from '@radix-ui/react-dialog';
import Link from 'next/link';
import { useState } from 'react';

/**
 * Mobile navigation.
 *
 * Radix Dialog again, so focus trapping and scroll lock behave the same as the
 * enquiry popup. Links close the drawer through an explicit callback rather
 * than an effect watching the pathname — closing is a consequence of the tap,
 * not of the render.
 */
export function NavDrawer() {
	const [open, setOpen] = useState(false);

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger
				aria-label="Open menu"
				className="flex size-11 items-center justify-center rounded-pill border border-line text-ink transition-colors hover:bg-surface-alt md:hidden"
			>
				<Icon name="menu" size={20} />
			</Dialog.Trigger>

			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/50 md:hidden" />
				<Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-[min(20rem,88vw)] flex-col bg-surface shadow-modal md:hidden">
					<Dialog.Title className="sr-only">Menu</Dialog.Title>

					<div className="flex items-center justify-end border-b border-line px-5 py-4">
						<Dialog.Close
							aria-label="Close menu"
							className="flex size-11 items-center justify-center rounded-pill border border-line text-ink"
						>
							<Icon name="close" size={18} />
						</Dialog.Close>
					</div>

					<nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
						{NAV_ITEMS.map((item) => (
							<NavLink
								key={item.href}
								href={item.href}
								onNavigate={() => setOpen(false)}
								className="rounded-field border-b-0 px-4 py-3.5 text-base font-medium text-body"
								activeClassName="bg-accent-tint font-semibold text-accent"
							>
								{item.label}
							</NavLink>
						))}
					</nav>

					<div className="flex flex-col gap-3 border-t border-line p-4">
						<Link
							href={CONTACT.phoneHref}
							className="flex items-center gap-2.5 px-4 py-2 text-sm text-body"
						>
							<Icon name="phone" size={17} className="text-accent" />
							{CONTACT.phoneDisplay}
						</Link>
						<Button asChild variant="chat" size="lg">
							<a href={chatHref()} target="_blank" rel="noopener noreferrer">
								<Icon name="chat" size={18} />
								Chat on {CHAT.label}
							</a>
						</Button>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
