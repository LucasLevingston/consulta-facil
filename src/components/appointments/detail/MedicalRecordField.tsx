"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function MedicalRecordField({
	label,
	value,
	onChange,
}: {
	label: string;
	value: string;
	onChange: (v: string) => void;
}) {
	return (
		<div className="space-y-1.5">
			<Label className="text-xs font-semibold text-primary">{label}</Label>
			<Textarea
				value={value}
				onChange={(e) => onChange(e.target.value)}
				rows={2}
				className="resize-none rounded-xl border-border bg-bg-input text-sm"
			/>
		</div>
	);
}
