import { debugLog } from '@/utils/Logger';

/**
 * Event tracking.
 *
 * Pushes to the GTM data layer if a container is on the page and does nothing
 * at all if there is not one. That ordering matters: the events can be wired
 * into the UI now and start reporting the day a GTM ID is added (E13), rather
 * than the analytics work having to go back and touch every button.
 *
 * No personal data goes through here. Events carry what happened and where,
 * never who — a phone number in a data layer push is a phone number in
 * whatever the container forwards to.
 */

type DataLayerEvent = {
	event: string;
	[key: string]: string | number | boolean | undefined;
};

declare global {
	interface Window {
		dataLayer?: DataLayerEvent[];
	}
}

export const ANALYTICS_EVENTS = {
	/** Someone opened the resident WhatsApp community. */
	whatsappCommunityJoin: 'whatsapp_community_join',
	/** Someone opened a one-to-one WhatsApp chat with the team. */
	whatsappChat: 'whatsapp_chat',
	/** An enquiry was submitted successfully. */
	enquirySubmitted: 'enquiry_submitted',
} as const;

export type AnalyticsEvent =
	(typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export function trackEvent(
	event: AnalyticsEvent,
	params: Record<string, string | number | boolean | undefined> = {},
) {
	if (typeof window === 'undefined') {
		return;
	}

	if (!window.dataLayer) {
		// Nothing is listening yet. Say so in development so a miswired event is
		// visible during the E13 work rather than silently doing nothing.
		if (process.env.NODE_ENV === 'development') {
			debugLog('[analytics] no dataLayer, dropped:', event, params);
		}
		return;
	}

	window.dataLayer.push({ event, ...params });
}
