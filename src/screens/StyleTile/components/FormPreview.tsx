'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ChipGroup } from '@/components/ui/ChipGroup';
import { Field } from '@/components/ui/Field';
import { Input, PhoneInput, Select, Textarea } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { MonthPicker } from '@/components/ui/MonthPicker';
import { useState } from 'react';

const ROOM_TYPES = [
	{ value: 'single', label: 'Single' },
	{ value: 'double', label: 'Double' },
	{ value: 'triple', label: 'Triple' },
	{ value: 'unsure', label: 'Not sure' },
];

/** Interactive island of the style tile — the form controls and the dialog. */
export function FormPreview() {
	const [roomType, setRoomType] = useState<string | null>('unsure');
	const [open, setOpen] = useState(false);

	return (
		<div className="grid gap-5 lg:grid-cols-2">
			<Card className="flex flex-col gap-5">
				<Field label="Full name" htmlFor="demo-name">
					<Input id="demo-name" placeholder="Your name" />
				</Field>

				<Field label="Phone" htmlFor="demo-phone">
					<PhoneInput id="demo-phone" />
				</Field>

				<Field
					label="Phone"
					htmlFor="demo-phone-error"
					error="Enter a 10-digit phone number"
				>
					<PhoneInput id="demo-phone-error" defaultValue="98765" error />
				</Field>

				<Field label="What is this about?" htmlFor="demo-subject">
					<Select id="demo-subject" defaultValue="booking">
						<option value="booking">Booking a room</option>
						<option value="visit">Visiting the property</option>
						<option value="parent">Parent enquiry</option>
						<option value="other">Something else</option>
					</Select>
				</Field>
			</Card>

			<Card className="flex flex-col gap-5">
				<Field label="Room type" htmlFor="demo-room">
					<ChipGroup
						label="Room type"
						name="demo-room"
						options={ROOM_TYPES}
						value={roomType}
						onChange={setRoomType}
					/>
				</Field>

				<Field
					label="Preferred move-in"
					htmlFor="demo-month"
					hint="Month is enough — we confirm the date on the call."
				>
					<MonthPicker id="demo-month" />
				</Field>

				<Field label="Anything else?" htmlFor="demo-message" optional>
					<Textarea
						id="demo-message"
						placeholder="Which college you're at, questions about food, timings…"
					/>
				</Field>

				<Button onClick={() => setOpen(true)}>Open the dialog</Button>
			</Card>

			<Modal
				open={open}
				onOpenChange={setOpen}
				title="Book a visit"
				description="We'll call you back within 24 hours with rent and availability."
			>
				<div className="flex flex-col gap-5">
					<Field label="Full name" htmlFor="modal-name">
						<Input id="modal-name" placeholder="Your name" />
					</Field>
					<Field label="Phone" htmlFor="modal-phone">
						<PhoneInput id="modal-phone" />
					</Field>
					<Field label="Room type" htmlFor="modal-room">
						<ChipGroup
							label="Room type"
							name="modal-room"
							options={ROOM_TYPES}
							value={roomType}
							onChange={setRoomType}
						/>
					</Field>
					<Button size="lg" className="w-full">
						Send enquiry
					</Button>
					<Button variant="chat" size="lg" className="w-full">
						Chat on WhatsApp instead
					</Button>
					<p className="text-center text-xs text-label">
						No payment is taken on this site.
					</p>
				</div>
			</Modal>
		</div>
	);
}
