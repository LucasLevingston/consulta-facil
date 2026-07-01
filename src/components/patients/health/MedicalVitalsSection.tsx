"use client";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getBmiLabel } from "@/utils/bmi";
import { toNumber } from "@/utils/to-number";
import { BloodTypeSelect } from "./BloodTypeSelect";
import type { MedicalVitalsSectionProps } from "./MedicalVitalsSection.types";

export function MedicalVitalsSection({
	control,
	bmi,
}: MedicalVitalsSectionProps) {
	return (
		<div className="flex gap-4 flex-wrap">
			<BloodTypeSelect control={control} />
			<FormField
				control={control}
				name="height"
				render={({ field }) => (
					<FormItem className="w-28">
						<FormLabel>Altura (m)</FormLabel>
						<FormControl>
							<Input
								type="number"
								step="0.01"
								placeholder="1.75"
								value={field.value ?? ""}
								onChange={(e) => field.onChange(toNumber(e.target.value))}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={control}
				name="weight"
				render={({ field }) => (
					<FormItem className="w-28">
						<FormLabel>Peso (kg)</FormLabel>
						<FormControl>
							<Input
								type="number"
								step="0.1"
								placeholder="70.0"
								value={field.value ?? ""}
								onChange={(e) => field.onChange(toNumber(e.target.value))}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			{bmi !== null && (
				<div className="flex flex-col justify-end pb-1">
					<p className="text-sm font-medium">
						IMC: {bmi.toFixed(1)}{" "}
						<span className="text-muted-foreground font-normal">
							({getBmiLabel(bmi)})
						</span>
					</p>
				</div>
			)}
		</div>
	);
}
