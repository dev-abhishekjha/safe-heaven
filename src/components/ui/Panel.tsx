import { cn } from '@/utils/UtilsClassName';
import type { ReactNode } from 'react';

type PanelTone = 'plain' | 'tint' | 'chat' | 'dark';

type PanelProps = {
	children: ReactNode;
	tone?: PanelTone;
	className?: string;
	padded?: boolean;
	as?: 'div' | 'section' | 'aside';
};

/**
 * A feature surface — bigger radius than `Card`, and the only place a tinted
 * or dark ground is allowed. `chat` carries the WhatsApp green and should be
 * used exclusively for messaging affordances, never as decoration.
 */
const TONES: Record<PanelTone, string> = {
	plain: 'border border-line bg-surface',
	tint: 'bg-accent-tint',
	chat: 'border border-chat-line bg-chat-tint',
	dark: 'bg-surface-dark text-white',
};

export function Panel({
	children,
	tone = 'plain',
	className,
	padded = true,
	as: Tag = 'div',
}: PanelProps) {
	return (
		<Tag
			className={cn(
				'rounded-panel',
				padded && 'p-7 sm:p-9',
				TONES[tone],
				className,
			)}
		>
			{children}
		</Tag>
	);
}
