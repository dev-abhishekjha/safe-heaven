'use client';

import { Icon } from '@/components/ui/Icon';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import type { GalleryItem } from '@/screens/Property/propertyContent';
import { cn } from '@/utils/UtilsClassName';
import * as Dialog from '@radix-ui/react-dialog';
import { type KeyboardEvent, useState } from 'react';

type PropertyGalleryProps = {
	items: GalleryItem[];
};

/**
 * The gallery, with a lightbox.
 *
 * Radix Dialog gives the parts that are tedious and easy to get wrong — focus
 * trap, focus restored to the thumbnail that opened it, scroll lock, Escape.
 * What it does not give is moving between photos, so the arrow keys are
 * handled on the content element rather than on `window`: the listener then
 * exists exactly as long as the lightbox does, with nothing to clean up and no
 * chance of it firing while the dialog is closed.
 *
 * `open` is derived from `index === null` rather than kept as a second piece
 * of state, so the two can never disagree about whether the lightbox is up.
 */
export function PropertyGallery({ items }: PropertyGalleryProps) {
	const [index, setIndex] = useState<number | null>(null);
	const current = index === null ? null : items[index];

	const step = (delta: number) => {
		setIndex((previous) => {
			if (previous === null) {
				return previous;
			}
			// Wraps, so holding the arrow key never dead-ends at either edge.
			return (previous + delta + items.length) % items.length;
		});
	};

	const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'ArrowRight') {
			event.preventDefault();
			step(1);
		}
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			step(-1);
		}
	};

	return (
		<>
			<ul className="grid grid-cols-2 gap-4 lg:grid-cols-3">
				{items.map((item, itemIndex) => (
					<li key={item.id} className={cn(item.wide && 'col-span-2')}>
						<button
							type="button"
							onClick={() => setIndex(itemIndex)}
							aria-label={`Open photo: ${item.label}`}
							className="block w-full rounded-card transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
						>
							<PlaceholderImage
								label={`Photo — ${item.label.toLowerCase()}`}
								className={cn('h-36 w-full sm:h-48', item.wide && 'sm:h-64')}
							/>
						</button>
					</li>
				))}
			</ul>

			<Dialog.Root
				open={current !== null}
				onOpenChange={(next) => {
					if (!next) {
						setIndex(null);
					}
				}}
			>
				<Dialog.Portal>
					<Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-[2px]" />
					<Dialog.Content
						onKeyDown={onKeyDown}
						className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 p-5 focus:outline-none sm:p-10"
					>
						<Dialog.Title className="sr-only">
							{current ? `Photo: ${current.label}` : 'Photo'}
						</Dialog.Title>
						<Dialog.Description className="sr-only">
							Use the left and right arrow keys to move between photos, and
							Escape to close.
						</Dialog.Description>

						<div className="flex w-full max-w-4xl items-center gap-3 sm:gap-5">
							<LightboxArrow
								direction="previous"
								onClick={() => step(-1)}
								disabled={items.length < 2}
							/>

							<PlaceholderImage
								label={current ? `Photo — ${current.label.toLowerCase()}` : ''}
								className="h-[50vh] flex-1 rounded-panel bg-surface"
							/>

							<LightboxArrow
								direction="next"
								onClick={() => step(1)}
								disabled={items.length < 2}
							/>
						</div>

						{/*
						 * A live region, because Radix announces Dialog.Title when the
						 * lightbox opens and never again. Without this, pressing the
						 * arrow keys changes the photo and a screen reader says nothing
						 * at all — the one interaction this component exists for.
						 */}
						<p
							aria-live="polite"
							aria-atomic="true"
							className="text-center text-sm text-white"
						>
							{current?.label}
							{index === null ? null : (
								<span className="ml-2 text-white/60">
									{index + 1} of {items.length}
								</span>
							)}
						</p>

						<Dialog.Close
							className="flex size-11 items-center justify-center rounded-pill bg-white/10 text-white transition-colors hover:bg-white/20"
							aria-label="Close the photo"
						>
							<Icon name="close" size={18} />
						</Dialog.Close>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</>
	);
}

function LightboxArrow({
	direction,
	onClick,
	disabled,
}: {
	direction: 'previous' | 'next';
	onClick: () => void;
	disabled?: boolean;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			aria-label={`${direction === 'next' ? 'Next' : 'Previous'} photo`}
			className="flex size-11 shrink-0 items-center justify-center rounded-pill bg-white/10 text-white transition-colors hover:bg-white/20 disabled:opacity-40"
		>
			<Icon
				name="arrowRight"
				size={18}
				className={direction === 'previous' ? 'rotate-180' : undefined}
			/>
		</button>
	);
}
