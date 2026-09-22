'use client';

import { Icon } from '@/components/ui/Icon';
import { useReturnFocus } from '@/components/ui/useReturnFocus';
import { cn } from '@/utils/UtilsClassName';
import * as Dialog from '@radix-ui/react-dialog';
import type { ReactNode } from 'react';

type ModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description?: string;
	children: ReactNode;
	/** Hide the visible title but keep it for screen readers. */
	hideTitle?: boolean;
	className?: string;
};

/**
 * One dialog for the whole site. On a phone it is a bottom sheet — thumb
 * reachable, with a grab handle; from `sm` up it is a centred dialog. Same
 * component, so the enquiry form is never built twice.
 *
 * Radix handles focus trapping, scroll lock, ESC and the `aria-labelledby`
 * wiring. It does NOT restore focus on close here: it restores to
 * `Dialog.Trigger`, and this modal is opened from state rather than through
 * one, so `useReturnFocus` does that part. A visually hidden title is still a title: a
 * dialog without one is unusable with a screen reader, so `title` is required.
 */
export function Modal({
	open,
	onOpenChange,
	title,
	description,
	children,
	hideTitle,
	className,
}: ModalProps) {
	const onCloseAutoFocus = useReturnFocus(open);

	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-[2px]" />
				<Dialog.Content
					onCloseAutoFocus={onCloseAutoFocus}
					className={cn(
						'fixed z-50 flex flex-col bg-surface shadow-modal',
						// phone: bottom sheet
						'inset-x-0 bottom-0 max-h-[92vh] rounded-t-[1.5rem]',
						// desktop: centred dialog
						'sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[min(34rem,92vw)]',
						'sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-panel',
						className,
					)}
				>
					{/* Grab handle — phone only, purely a visual affordance. */}
					<div
						aria-hidden
						className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-pill bg-line sm:hidden"
					/>

					<div className="flex items-start justify-between gap-4 px-6 pb-4 pt-4 sm:px-7 sm:pt-6">
						<div className="flex flex-col gap-1.5">
							<Dialog.Title
								className={cn(
									'font-display text-2xl font-semibold text-ink',
									hideTitle && 'sr-only',
								)}
							>
								{title}
							</Dialog.Title>
							{description ? (
								<Dialog.Description className="text-sm leading-relaxed text-muted">
									{description}
								</Dialog.Description>
							) : null}
						</div>

						<Dialog.Close
							className="flex size-11 shrink-0 items-center justify-center rounded-pill bg-surface-alt text-muted transition-colors hover:bg-surface-sunken hover:text-ink"
							aria-label="Close"
						>
							<Icon name="close" size={16} />
						</Dialog.Close>
					</div>

					<div className="overflow-y-auto px-6 pb-8 sm:px-7 sm:pb-7">
						{children}
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

export const ModalTrigger = Dialog.Trigger;
