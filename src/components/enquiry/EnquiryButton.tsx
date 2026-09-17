'use client';

import {
	type EnquiryPrefill,
	useEnquiry,
} from '@/components/enquiry/EnquiryProvider';
import { Button } from '@/components/ui/Button';
import type { ComponentProps } from 'react';

type EnquiryButtonProps = Omit<ComponentProps<typeof Button>, 'onClick'> & {
	prefill?: EnquiryPrefill;
};

/**
 * Any button that opens the enquiry popup.
 *
 * One component for every trigger — header, hero, room cards, action bar — so
 * a room card can pass `prefill={{ roomType: 'double' }}` and the form opens
 * already answering the question the visitor just showed interest in.
 */
export function EnquiryButton({
	prefill,
	children = 'Book a Visit',
	...props
}: EnquiryButtonProps) {
	const { openEnquiry } = useEnquiry();

	return (
		<Button onClick={() => openEnquiry(prefill)} {...props}>
			{children}
		</Button>
	);
}
