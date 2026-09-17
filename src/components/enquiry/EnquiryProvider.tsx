'use client';

import { EnquiryModal } from '@/components/enquiry/EnquiryModal';
import { usePathname } from 'next/navigation';
import {
	type ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';

export type EnquiryPrefill = {
	/** Preselects a room type when opened from a specific room. */
	roomType?: 'single' | 'double' | 'triple' | 'unsure';
	/** Where the visitor was — stored on the lead so you know what converts. */
	source?: string;
};

type EnquiryContextValue = {
	openEnquiry: (prefill?: EnquiryPrefill) => void;
	closeEnquiry: () => void;
};

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

/** Auto-open settings. Kept here so the behaviour is legible in one place. */
const AUTO_OPEN_DELAY_MS = 25_000;
const SEEN_KEY = 'sh.enquiry.seen';

function hasSeen() {
	try {
		return window.localStorage.getItem(SEEN_KEY) === '1';
	} catch {
		// Private browsing, blocked storage — treat as unseen but harmless.
		return false;
	}
}

function markSeen() {
	try {
		window.localStorage.setItem(SEEN_KEY, '1');
	} catch {
		// Nothing to do; the popup simply may appear again next visit.
	}
}

/**
 * Owns the enquiry popup for the whole site.
 *
 * Mounted once in the layout so every "Book a Visit" anywhere opens the same
 * dialog with the same state, instead of each page carrying its own copy.
 *
 * Auto-open is deliberately restrained: home page only, once per visitor, on a
 * delay or on exit intent — then never again. A popup that reappears on every
 * page is the fastest way to make someone leave.
 */
export function EnquiryProvider({ children }: { children: ReactNode }) {
	const [open, setOpen] = useState(false);
	const [prefill, setPrefill] = useState<EnquiryPrefill>({});
	const pathname = usePathname();
	const autoOpened = useRef(false);

	const openEnquiry = useCallback((next?: EnquiryPrefill) => {
		setPrefill(next ?? {});
		setOpen(true);
	}, []);

	const closeEnquiry = useCallback(() => setOpen(false), []);

	const handleOpenChange = useCallback((next: boolean) => {
		setOpen(next);
		// Dismissing counts as seen — do not ask twice in one visit.
		if (!next) markSeen();
	}, []);

	useEffect(() => {
		if (pathname !== '/' || autoOpened.current || hasSeen()) return;

		const trigger = (source: string) => {
			if (autoOpened.current || hasSeen()) return;
			autoOpened.current = true;
			setPrefill({ source });
			setOpen(true);
		};

		const timer = window.setTimeout(
			() => trigger('auto-delay'),
			AUTO_OPEN_DELAY_MS,
		);

		// Exit intent: pointer leaves through the top of the window.
		const onMouseOut = (event: MouseEvent) => {
			if (event.clientY <= 0 && !event.relatedTarget)
				trigger('auto-exit-intent');
		};
		document.addEventListener('mouseout', onMouseOut);

		return () => {
			window.clearTimeout(timer);
			document.removeEventListener('mouseout', onMouseOut);
		};
	}, [pathname]);

	const value = useMemo(
		() => ({ openEnquiry, closeEnquiry }),
		[openEnquiry, closeEnquiry],
	);

	return (
		<EnquiryContext.Provider value={value}>
			{children}
			<EnquiryModal
				open={open}
				onOpenChange={handleOpenChange}
				prefill={prefill}
			/>
		</EnquiryContext.Provider>
	);
}

export function useEnquiry() {
	const context = useContext(EnquiryContext);
	if (!context) {
		throw new Error('useEnquiry must be used inside <EnquiryProvider>');
	}
	return context;
}
