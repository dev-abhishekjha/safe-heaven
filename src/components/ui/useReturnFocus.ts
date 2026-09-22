'use client';

import { useCallback, useEffect, useRef } from 'react';

/**
 * Put focus back where it came from when a dialog closes.
 *
 * Radix restores focus to `Dialog.Trigger`. Neither dialog on this site uses
 * one — the enquiry modal and the gallery lightbox are both driven from state
 * by ordinary buttons — so Radix's `triggerRef` is null, it has nothing to
 * restore to, and focus falls to `<body>`.
 *
 * Measured on the live site rather than inferred: open the lightbox, press
 * Escape, and `document.activeElement` is `body`. A keyboard user is returned
 * to the top of the document and has to tab through the whole header to get
 * back to the thumbnail they were on. PropertyGallery's own docblock claimed
 * focus was "restored to the thumbnail that opened it"; it was not.
 *
 * The last focused element is recorded WHILE THE DIALOG IS CLOSED rather than
 * at the moment it opens. By the time an `open` effect runs, Radix has already
 * moved focus inside the dialog, so reading `document.activeElement` then
 * records the dialog's own first control — which is how this kind of fix
 * usually ends up restoring focus to something that no longer exists.
 */
export function useReturnFocus(open: boolean) {
	const previous = useRef<HTMLElement | null>(null);

	useEffect(() => {
		if (open) {
			return;
		}
		const remember = () => {
			previous.current = document.activeElement as HTMLElement | null;
		};
		document.addEventListener('focusin', remember);
		return () => document.removeEventListener('focusin', remember);
	}, [open]);

	/** Pass to Radix's `onCloseAutoFocus`. */
	return useCallback((event: Event) => {
		const target = previous.current;
		// `isConnected` matters: the trigger may have been unmounted while the
		// dialog was open. Falling through to Radix's own behaviour is better
		// than focusing a detached node.
		if (!target || !target.isConnected) {
			return;
		}
		event.preventDefault();
		target.focus();
	}, []);
}
