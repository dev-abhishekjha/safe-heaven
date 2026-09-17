'use client';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { ADDRESS, MAP } from '@/utils/SiteConfig';
import { useState } from 'react';

/**
 * The map, loaded only when asked for.
 *
 * A Google Maps iframe is roughly a megabyte of third-party JavaScript and it
 * loads on every page view whether or not anyone looks at it — on a mid-range
 * Android on mobile data, which is most of this traffic, that is the single
 * most expensive thing on the page.
 *
 * Holding it behind a click also means no request reaches Google until the
 * visitor asks for one, which is the right default regardless of performance.
 * The "Open in Maps" link is always there, and for someone on a phone it is
 * the better answer anyway — it opens the app they will actually navigate
 * with.
 */
export function ContactMap() {
	const [loaded, setLoaded] = useState(false);

	return (
		<div className="flex flex-col gap-3">
			<div className="relative h-72 overflow-hidden rounded-panel border border-accent-line bg-accent-tint-strong sm:h-96">
				{loaded ? (
					<iframe
						src={MAP.embedUrl}
						title={`Map showing ${ADDRESS.line1}, ${ADDRESS.line2}`}
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade"
						className="size-full border-0"
					/>
				) : (
					<div className="flex size-full flex-col items-center justify-center gap-4 p-6 text-center">
						<Icon name="pin" size={26} className="text-accent" aria-hidden />
						<div className="flex flex-col gap-1">
							<span className="text-base font-semibold text-ink">
								{ADDRESS.line1}
							</span>
							<span className="text-sm text-body">{ADDRESS.line2}</span>
						</div>
						<Button variant="secondary" onClick={() => setLoaded(true)}>
							Load the map
						</Button>
						<p className="max-w-[34ch] text-xs text-muted">
							Held back until you ask, so nothing loads from Google on arrival.
						</p>
					</div>
				)}
			</div>

			<a
				href={MAP.openUrl}
				target="_blank"
				rel="noopener noreferrer"
				className="flex w-fit items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-accent"
			>
				Open in Google Maps
				<Icon name="arrowRight" size={15} aria-hidden />
			</a>
		</div>
	);
}
