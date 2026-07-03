"use client";

import type { Control } from "react-hook-form";
import {
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import type {
	PaymentTiming,
	UpdatePaymentSettingsInput,
} from "@/features/professionals";

const TIMING_OPTIONS: { value: PaymentTiming; label: string; desc: string }[] =
	[
		{
			value: "AT_SCHEDULING",
			label: "No agendamento",
			desc: "Paciente paga ao marcar a consulta",
		},
		{
			value: "AT_CONSULTATION",
			label: "Na consulta",
			desc: "Paciente paga presencialmente no dia",
		},
	];

interface Props {
	control: Control<UpdatePaymentSettingsInput>;
}

export function PaymentTimingField({ control }: Props) {
	return (
		<FormField
			control={control}
			name="paymentTiming"
			render={({ field }) => (
				<FormItem>
					<FormLabel className="text-sm font-medium">
						Momento do pagamento
					</FormLabel>
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						{TIMING_OPTIONS.map((opt) => (
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
	);
}
