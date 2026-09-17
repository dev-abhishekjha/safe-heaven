import { ScreenStyleTile } from '@/screens/StyleTile/ScreenStyleTile';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Style tile',
	// Internal reference page — never index it.
	robots: { index: false, follow: false },
};

export default function StyleTilePage() {
	return <ScreenStyleTile />;
}
