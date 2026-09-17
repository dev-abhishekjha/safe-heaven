import { Icon, type IconName } from '@/components/ui/Icon';
import { ADDRESS, CONTACT } from '@/utils/SiteConfig';

type Row = {
	icon: IconName;
	label: string;
	value: string;
	href?: string;
	note?: string;
};

/**
 * Address, phone, email, hours.
 *
 * Phone and email are real links: on a phone, a number you cannot tap is a
 * number you have to memorise and retype, which is where an enquiry gets
 * lost. Everything here reads from `SiteConfig`, so the day the real number
 * arrives (E15.11) it changes in one place.
 */
export function ContactDetails() {
	const rows: Row[] = [
		{
			icon: 'pin',
			label: 'Address',
			value: `${ADDRESS.line1}, ${ADDRESS.line2}`,
		},
		{
			icon: 'phone',
			label: 'Phone',
			value: CONTACT.phoneDisplay,
			href: CONTACT.phoneHref,
		},
		{
			icon: 'mail',
			label: 'Email',
			value: CONTACT.email,
			href: CONTACT.emailHref,
		},
		{
			icon: 'clock',
			label: 'Visiting hours',
			value: CONTACT.visitingHours,
			note: 'Drop in, or call ahead and we will keep someone free.',
		},
	];

	return (
		<dl className="flex flex-col">
			{rows.map((row, index) => (
				<div
					key={row.label}
					className={
						index < rows.length - 1
							? 'flex gap-4 border-b border-line-soft py-5 first:pt-0'
							: 'flex gap-4 pt-5'
					}
				>
					<span className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-accent-tint text-accent">
						<Icon name={row.icon} size={18} aria-hidden />
					</span>
					<div className="flex flex-col gap-1">
						<dt className="text-xs uppercase tracking-[0.08em] text-label">
							{row.label}
						</dt>
						<dd className="flex flex-col gap-1">
							{row.href ? (
								<a
									href={row.href}
									className="text-base font-semibold text-ink transition-colors hover:text-accent"
								>
									{row.value}
								</a>
							) : (
								<span className="text-base text-ink">{row.value}</span>
							)}
							{row.note ? (
								<span className="text-sm text-muted">{row.note}</span>
							) : null}
						</dd>
					</div>
				</div>
			))}
		</dl>
	);
}
