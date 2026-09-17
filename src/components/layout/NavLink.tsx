'use client';

import { cn } from '@/utils/UtilsClassName';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

type NavLinkProps = {
	href: string;
	children: ReactNode;
	className?: string;
	activeClassName?: string;
	onNavigate?: () => void;
};

/**
 * A nav link that knows whether it is the current page.
 *
 * `aria-current="page"` is the part that matters — the orange underline tells
 * sighted visitors where they are, and this tells everyone else. One small
 * client component so the header itself can stay a Server Component.
 */
export function NavLink({
	href,
	children,
	className,
	activeClassName = 'border-action font-semibold text-ink',
	onNavigate,
}: NavLinkProps) {
	const pathname = usePathname();
	const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);

	return (
		<Link
			href={href}
			onClick={onNavigate}
			aria-current={isActive ? 'page' : undefined}
			className={cn(
				'border-b-2 border-transparent transition-colors hover:text-ink',
				className,
				isActive && activeClassName,
			)}
		>
			{children}
		</Link>
	);
}
