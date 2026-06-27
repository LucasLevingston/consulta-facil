"use client";

import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import type { ModalityStepProps } from "./ModalityStep.types";

const MODALITY_OPTIONS = [
	{
		value: "IN_PERSON" as const,
		label: "Presencial",
		desc: "Na clínica ou consultório",
	},
	{
		value: "ONLINE" as const,
		label: "Online",
		desc: "Videochamada via Google Meet",
	},
];

export function ModalityStep({ control }: ModalityStepProps) {
	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2">
				<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
					4
				</div>
				<h3 className="font-semibold text-foreground">Modalidade</h3>
			</div>
			<FormField
				control={control}
				name="modality"
				render={({ field }) => (
					<FormItem>
						<div className="grid grid-cols-2 gap-3">
							{MODALITY_OPTIONS.map((opt) => (
								<button
									key={opt.value}
									type="button"
									onClick={() => field.onChange(opt.value)}
									className={`flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-colors ${
										field.value === opt.value
											? "border-primary bg-primary/5 text-primary"
											: "border-border hover:border-primary/40"
									}`}
								>
									<span className="text-sm font-semibold">{opt.label}</span>
									<span className="text-xs text-muted-foreground">
										{opt.desc}
									</span>
								</button>
							))}
						</div>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
