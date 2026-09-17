import { CtaBand } from '@/components/sections/CtaBand';

/**
 * The last thing on the home page.
 *
 * A visitor who has read this far has already decided they are interested, so
 * this asks once, plainly, and puts the phone number next to it for the parent
 * who would rather ring than fill anything in.
 */
export function HomeClosingCta() {
	return (
		<CtaBand
			title="Come and see the place before you decide."
			body="Tell us when suits you and we will call back to arrange a visit. Nothing is paid on this website."
			source="home-closing"
		/>
	);
}
