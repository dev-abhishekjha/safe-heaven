import 'server-only';

import type {
	AboutPage,
	CommunityPage,
	HomePage,
	SiteSetting,
} from '@/payload-types';
import { getPayloadClient } from '@/repositories/payloadClient';
import { cache } from 'react';

/**
 * Globals — site-wide settings and per-page editable copy.
 *
 * `getSiteSettings` is called by the header, the footer, the action bar and
 * every WhatsApp link, so the request-level memoisation matters more here than
 * anywhere else: one query per request, not eight.
 */

export const getSiteSettings = cache(async (): Promise<SiteSetting> => {
	const payload = await getPayloadClient();
	return payload.findGlobal({ slug: 'site-settings', depth: 1 });
});

export const getHomePage = cache(async (): Promise<HomePage> => {
	const payload = await getPayloadClient();
	return payload.findGlobal({ slug: 'home-page', depth: 1 });
});

export const getAboutPage = cache(async (): Promise<AboutPage> => {
	const payload = await getPayloadClient();
	return payload.findGlobal({ slug: 'about-page', depth: 1 });
});

export const getCommunityPage = cache(async (): Promise<CommunityPage> => {
	const payload = await getPayloadClient();
	return payload.findGlobal({ slug: 'community-page', depth: 1 });
});
