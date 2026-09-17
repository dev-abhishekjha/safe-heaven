import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { SeedRoom } from '@/content/rooms';
import { COMPARISON_ROWS } from '@/screens/Property/propertyContent';

/**
 * The three rooms side by side.
 *
 * Two renderings of one data set, not two hand-written blocks: both read
 * `COMPARISON_ROWS`, so a row added later appears in both or neither. A
 * four-column table does not survive 390px, and the usual fixes — horizontal
 * scroll, or shrinking the type until it fits — both make it unreadable on the
 * device most of this traffic arrives on. Stacking one card per room keeps
 * every value at full size.
 *
 * There is no rent row with a number in it. The last row says so out loud
 * rather than leaving a gap where a price would be.
 */
export function PropertyComparison({ rooms }: { rooms: SeedRoom[] }) {
	return (
		<>
			{/* Desktop: a real table, so it is announced as one. */}
			<div className="hidden overflow-hidden rounded-panel border border-line lg:block">
				<table className="w-full border-collapse text-left">
					<caption className="sr-only">
						The three room types compared across occupancy, beds, storage and
						who each one suits.
					</caption>
					<thead>
						<tr className="bg-surface-alt">
							<th scope="col" className="w-44 px-6 py-5 text-sm text-label">
								<span className="sr-only">Feature</span>
							</th>
							{rooms.map((room) => (
								<th key={room.key} scope="col" className="px-6 py-5">
									<span className="flex flex-col gap-2">
										<span className="text-base font-semibold text-ink">
											{room.name}
										</span>
										<Badge tone={room.availability} className="w-fit">
											{room.availabilityLabel}
										</Badge>
									</span>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{COMPARISON_ROWS.map((row) => (
							<tr key={row.label} className="border-t border-line-soft">
								<th
									scope="row"
									className="px-6 py-5 align-top text-sm font-semibold text-ink"
								>
									{row.label}
								</th>
								{rooms.map((room) => (
									<td
										key={room.key}
										className="px-6 py-5 align-top text-sm leading-relaxed text-body"
									>
										{row.value(room)}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Phone and tablet: one card per room, same rows in the same order. */}
			<ul className="flex flex-col gap-5 lg:hidden">
				{rooms.map((room) => (
					<Card as="li" key={room.key} className="flex flex-col gap-4">
						<div className="flex items-center justify-between gap-3">
							<h3 className="text-lg font-semibold text-ink">{room.name}</h3>
							<Badge tone={room.availability}>{room.availabilityLabel}</Badge>
						</div>

						<dl className="flex flex-col">
							{COMPARISON_ROWS.map((row, rowIndex) => (
								<div
									key={row.label}
									className={
										rowIndex < COMPARISON_ROWS.length - 1
											? 'flex flex-col gap-1 border-b border-line-soft py-3'
											: 'flex flex-col gap-1 pt-3'
									}
								>
									<dt className="text-xs uppercase tracking-[0.08em] text-label">
										{row.label}
									</dt>
									<dd className="text-sm leading-relaxed text-ink-soft">
										{row.value(room)}
									</dd>
								</div>
							))}
						</dl>
					</Card>
				))}
			</ul>
		</>
	);
}
