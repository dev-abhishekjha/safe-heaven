import { Icon } from '@/components/ui/Icon';
import { ADDRESS, MAP } from '@/utils/SiteConfig';
import { cn } from '@/utils/UtilsClassName';

/**
 * The map.
 *
 * Loads on its own, like a map on any other site. It used to sit behind a
 * "Load the map" button so that nothing reached Google until a visitor asked,
 * which is a defensible privacy default but an odd one to meet on a page whose
 * entire job is answering "where is this building". That trade was made
 * deliberately and has now been reversed just as deliberately.
 *
 * The cost it was avoiding is handled instead by `loading="lazy"`: the browser
 * fetches nothing until the frame is near the viewport, so a visitor who never
 * scrolls this far still pays nothing. No state, no click, no client
 * JavaScript — this renders on the server.
 *
 * The iframe is absolutely positioned rather than `size-full`. `height: 100%`
 * resolves against the parent's *height*, and this parent's is set by
 * `min-height` — so the percentage had nothing to resolve against, fell back
 * to the iframe's default 150px, and the map rendered as a strip across the
 * top of an otherwise empty box. `inset-0` fills the frame however its height
 * was arrived at.
 *
 * `className` sizes the whole block, not the frame: the frame is `flex-1` over
 * a minimum height, so dropping this into a grid cell lets it stretch to match
 * the column beside it, and dropping it into ordinary flow leaves it at the
 * minimum.
 */
export function MapEmbed({ className }: { className?: string }) {
	return (
		<div className={cn('flex flex-col gap-3', className)}>
			<div className="relative min-h-72 flex-1 overflow-hidden rounded-panel border border-accent-line bg-accent-tint-strong sm:min-h-96">
				<iframe
					src={MAP.embedUrl}
					title={`Map showing ${ADDRESS.line1}, ${ADDRESS.line2}`}
					loading="lazy"
					referrerPolicy="no-referrer-when-downgrade"
					className="absolute inset-0 size-full border-0"
				/>
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
