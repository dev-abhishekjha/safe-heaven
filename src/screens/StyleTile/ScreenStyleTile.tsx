import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { DistanceList } from '@/components/ui/DistanceList';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Panel } from '@/components/ui/Panel';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { Eyebrow, SectionHeading } from '@/components/ui/SectionHeading';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { FormPreview } from './components/FormPreview';

const VARIANTS = ['primary', 'secondary', 'tertiary', 'chat', 'ghost'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;
const TONES = ['available', 'limited', 'unavailable', 'placeholder'] as const;
const PANEL_TONES = ['plain', 'tint', 'chat', 'dark'] as const;

const ICONS: IconName[] = [
	'home',
	'security',
	'securityCheck',
	'metro',
	'pin',
	'campus',
	'hospital',
	'shopping',
	'wifi',
	'power',
	'water',
	'housekeeping',
	'inclusive',
	'community',
	'opportunity',
	'chat',
	'phone',
	'mail',
	'clock',
	'calendar',
	'check',
	'arrowRight',
	'chevronDown',
	'close',
	'menu',
];

function Row({ label, children }: { label: string; children: ReactNode }) {
	return (
		<div className="flex flex-col gap-3 border-t border-line-soft pt-5">
			<Eyebrow className="text-label">{label}</Eyebrow>
			<div className="flex flex-wrap items-center gap-3">{children}</div>
		</div>
	);
}

/** Living reference for the design system. Not part of the public site. */
export function ScreenStyleTile() {
	return (
		<Container className="flex flex-col gap-14 py-16">
			<SectionHeading
				as="h1"
				eyebrow="Design system"
				title="Tokens & components"
				description="Sky is a tint for sections, icons and links. Orange is the only colour that means click. Green appears only for WhatsApp."
			/>

			<section className="flex flex-col gap-6">
				<h2 className="font-display text-3xl font-semibold">Buttons</h2>
				{VARIANTS.map((variant) => (
					<Row key={variant} label={variant}>
						{SIZES.map((size) => (
							<Button key={size} variant={variant} size={size}>
								{size === 'lg' ? 'Book a Visit' : 'Enquire'}
							</Button>
						))}
					</Row>
				))}
				<Row label="disabled">
					<Button disabled>Unavailable</Button>
					<Button asChild variant="secondary">
						<Link href="/">Rendered as a link</Link>
					</Button>
				</Row>
			</section>

			<section className="flex flex-col gap-6">
				<h2 className="font-display text-3xl font-semibold">Badges</h2>
				<Row label="tones">
					{TONES.map((tone) => (
						<Badge key={tone} tone={tone}>
							{tone}
						</Badge>
					))}
				</Row>
			</section>

			<section className="flex flex-col gap-6">
				<h2 className="font-display text-3xl font-semibold">Surfaces</h2>
				<div className="grid gap-5 sm:grid-cols-2">
					<Card>
						<h3 className="text-title font-semibold">Card</h3>
						<p className="mt-2 text-sm leading-relaxed text-body">
							Default content surface — hairline border, 18px radius.
						</p>
					</Card>
					{PANEL_TONES.map((tone) => (
						<Panel key={tone} tone={tone}>
							<h3 className="text-title font-semibold">Panel · {tone}</h3>
							<p
								className={
									tone === 'dark'
										? 'mt-2 text-sm leading-relaxed text-slate-300'
										: 'mt-2 text-sm leading-relaxed text-body'
								}
							>
								Feature surface, 20px radius.
							</p>
						</Panel>
					))}
				</div>
			</section>

			<section className="flex flex-col gap-6">
				<h2 className="font-display text-3xl font-semibold">Type scale</h2>
				<div className="flex flex-col gap-4 border-t border-line-soft pt-5">
					<p className="font-display text-display font-semibold">Display</p>
					<p className="font-display text-section font-semibold">Section</p>
					<p className="text-title font-semibold">Card title</p>
					<p className="max-w-[38rem] text-base leading-relaxed text-body">
						Body copy runs at 1.75 line height and never wider than about 620px,
						so a parent reading on a phone is not fighting the measure.
					</p>
					<Eyebrow>Eyebrow</Eyebrow>
				</div>
			</section>

			<section className="flex flex-col gap-6">
				<h2 className="font-display text-3xl font-semibold">Form controls</h2>
				<FormPreview />
			</section>

			<section className="flex flex-col gap-6">
				<h2 className="font-display text-3xl font-semibold">Distances</h2>
				<div className="grid gap-5 sm:grid-cols-2">
					<Card>
						<DistanceList
							items={[
								{
									name: 'Knowledge Park II',
									distance: '300 m',
									note: 'About a three-minute walk',
									highlight: true,
								},
								{ name: 'Pari Chowk', distance: '1.2 km' },
								{ name: 'Ram-Eesh Group of Institutions', distance: '1.5 km' },
								{
									name: 'Galgotias College of Engineering',
									distance: '2.5 km',
								},
							]}
						/>
					</Card>
					<div className="grid gap-4">
						<PlaceholderImage label="Photo — single room" className="h-32" />
						<PlaceholderImage
							tone="map"
							label="Map — Mitra Enclave, Sector P7"
							className="h-32"
						/>
					</div>
				</div>
			</section>

			<section className="flex flex-col gap-6">
				<h2 className="font-display text-3xl font-semibold">Icons</h2>
				<div className="flex flex-wrap gap-6 border-t border-line-soft pt-5 text-accent">
					{ICONS.map((name) => (
						<div key={name} className="flex w-20 flex-col items-center gap-2">
							<Icon name={name} />
							<span className="text-center text-[10px] text-label">{name}</span>
						</div>
					))}
				</div>
			</section>
		</Container>
	);
}
