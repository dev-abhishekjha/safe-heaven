/**
 * WCAG 2.1 AA contrast audit over the design tokens.
 *
 *   npm run check:contrast
 *
 * Every colour on this site comes from a token in globals.css, so the pairs
 * that can appear on screen are knowable and few. Each one below names where
 * it is used, so a failure points at a component rather than at a hex code.
 *
 * This exists because "the buttons look fine" was true and wrong at the same
 * time: white on #f97316 measures 2.80:1 against a 4.5:1 requirement, and no
 * amount of looking at it would have said so.
 *
 * Thresholds:
 *   4.5  body text (1.4.3)
 *   3    text at 24px, or 18.66px bold (1.4.3), and the boundary of a control
 *        or meaningful graphic (1.4.11)
 *   null report the number, do not enforce — disabled controls are exempt
 *        from 1.4.3, and a purely decorative divider from 1.4.11
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const css = readFileSync(
	path.join(here, '../src/app/(frontend)/globals.css'),
	'utf8',
);

const t = Object.fromEntries(
	[...css.matchAll(/--(color-[a-z-]+):\s*(#[0-9a-fA-F]{3,8})\s*;/g)].map((m) => [
		m[1],
		m[2],
	]),
);

const channels = (hex) => {
	const h = hex.replace('#', '');
	const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
	return [0, 2, 4].map((i) => Number.parseInt(full.slice(i, i + 2), 16) / 255);
};

const luminance = (hex) => {
	const [r, g, b] = channels(hex).map((c) =>
		c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
	);
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const ratio = (a, b) => {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
};

const WHITE = '#ffffff';

/** [what, foreground, background, required ratio or null, where it lives] */
const PAIRS = [
	['Button primary', WHITE, t['color-action'], 4.5, 'Button.tsx primary'],
	['Button primary hover', WHITE, t['color-action-hover'], 4.5, 'Button.tsx primary:hover'],
	['Button tertiary', t['color-action-ink'], t['color-action-tint'], 4.5, 'Button.tsx tertiary'],
	['Button tertiary hover', t['color-action-ink'], t['color-action-tint-strong'], 4.5, 'Button.tsx tertiary:hover'],
	['Button secondary', t['color-ink'], t['color-surface'], 4.5, 'Button.tsx secondary'],
	['Button chat', WHITE, t['color-chat'], 4.5, 'Button.tsx chat, ChatButton'],
	['Button chat hover', WHITE, t['color-chat-hover'], 4.5, 'Button.tsx chat:hover'],
	['Button disabled', t['color-label'], t['color-line'], null, 'exempt — 1.4.3 disabled'],

	['Heading', t['color-ink'], t['color-surface'], 4.5, 'h1–h3'],
	['Subheading', t['color-ink-soft'], t['color-surface'], 4.5, 'h4, lead-ins'],
	['Body', t['color-body'], t['color-surface'], 4.5, 'paragraphs'],
	['Body on alt', t['color-body'], t['color-surface-alt'], 4.5, 'alternating sections'],
	['Body on sunken', t['color-body'], t['color-surface-sunken'], 4.5, 'panels'],
	['Muted', t['color-muted'], t['color-surface'], 4.5, 'occupancy, captions'],
	['Muted on alt', t['color-muted'], t['color-surface-alt'], 4.5, 'cards'],
	['Label / eyebrow', t['color-label'], t['color-surface'], 4.5, 'eyebrows, field labels, placeholders'],
	['Label on alt', t['color-label'], t['color-surface-alt'], 4.5, 'placeholders on tinted cards'],
	['Text on dark', WHITE, t['color-surface-dark'], 4.5, 'footer'],

	['Link', t['color-accent'], t['color-surface'], 4.5, 'inline links'],
	['Link on tint', t['color-accent'], t['color-accent-tint'], 4.5, 'info panels'],
	['Link on strong tint', t['color-accent'], t['color-accent-tint-strong'], 4.5, 'highlighted panels'],
	['Focus ring', t['color-accent'], t['color-surface'], 3, 'globals.css :focus-visible'],
	['Focus ring on alt', t['color-accent'], t['color-surface-alt'], 3, ':focus-visible'],

	['Badge available', t['color-ok'], t['color-ok-tint'], 4.5, 'Badge.tsx'],
	['Badge few left', t['color-warn'], t['color-warn-tint'], 4.5, 'Badge.tsx'],
	['Badge limited', t['color-action-ink'], t['color-action-tint'], 4.5, 'Badge.tsx'],
	['Form error', t['color-danger-ink'], t['color-surface'], 4.5, 'Field.tsx'],
	['Field border', t['color-field-line'], t['color-surface'], 3, 'Field.tsx CONTROL_CLASSES'],
	['Divider', t['color-line'], t['color-surface'], null, 'decorative — 1.4.11 n/a'],
];

let failures = 0;
const rows = PAIRS.map(([label, fg, bg, need, where]) => {
	if (!fg || !bg) {
		failures += 1;
		return { label, value: 'MISSING', need: '—', mark: '✗', where };
	}
	const r = ratio(fg, bg);
	const failed = need !== null && r < need;
	if (failed) failures += 1;
	return {
		label,
		value: `${r.toFixed(2)}:1`,
		need: need === null ? '—' : `${need}:1`,
		mark: failed ? '✗' : need === null ? '·' : '✓',
		where: `${fg} on ${bg} · ${where}`,
	};
});

const width = Math.max(...rows.map((r) => r.label.length));
for (const r of rows) {
	process.stdout.write(
		`${r.mark} ${r.label.padEnd(width)}  ${r.value.padStart(8)}  need ${r.need.padStart(6)}   ${r.where}\n`,
	);
}
process.stdout.write(
	failures === 0
		? '\nAll enforced pairs meet WCAG AA.\n'
		: `\n${failures} pair(s) below WCAG AA.\n`,
);
process.exit(failures === 0 ? 0 : 1);
