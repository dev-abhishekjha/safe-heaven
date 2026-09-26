import { cn } from '@/utils/UtilsClassName';
import Image from 'next/image';

/**
 * A photo that came from the CMS.
 *
 * The counterpart to `PlaceholderImage`, and deliberately beside it: every
 * section that renders a placeholder today swaps to this one the moment real
 * media exists, so the two want the same shape and the same sizing props.
 *
 * `alt` is not optional and has no default. The Media collection already makes
 * a description mandatory at the schema level, so by the time an image reaches
 * this component the text exists — accepting an empty string here would only
 * let a caller throw it away.
 */
export type MediaImageSource = {
	url: string;
	alt: string;
	width?: number;
	height?: number;
};

type MediaImageProps = {
	source: MediaImageSource;
	/** Sizing and shape of the frame — the image fills it and is cropped. */
	className?: string;
	/**
	 * What width the image will actually occupy, so the browser picks the right
	 * file rather than the largest one. Defaults to full viewport width, which
	 * is correct but wasteful for anything in a column.
	 */
	sizes?: string;
	/**
	 * Only for the one image above the fold — normally the hero, which is the
	 * page's largest paint. It is preloaded from `<head>` and fetched at high
	 * priority. Every other image stays lazy: set this on several and they
	 * compete for the same bandwidth, so the one that matters arrives later,
	 * not sooner.
	 */
	priority?: boolean;
	/**
	 * Which part of the photo survives the crop. `top` for anything with a
	 * person in it: a face sits in the upper third, so centre-cropping a
	 * portrait into a wide frame cuts the head off.
	 */
	anchor?: 'center' | 'top';
};

export function MediaImage({
	source,
	className,
	sizes = '100vw',
	priority,
	anchor = 'center',
}: MediaImageProps) {
	return (
		<div className={cn('relative overflow-hidden bg-surface-alt', className)}>
			<Image
				src={source.url}
				alt={source.alt}
				fill
				sizes={sizes}
				// Next 16 deprecated `priority` in favour of `preload`, and neither
				// raises the request's own priority any more — the live hero was
				// going out as `fetchpriority="auto"`. So it is set explicitly.
				preload={priority}
				fetchPriority={priority ? 'high' : undefined}
				className={cn(
					'object-cover',
					anchor === 'top' ? 'object-top' : 'object-center',
				)}
			/>
		</div>
	);
}
