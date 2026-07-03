"use client";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { BLOOD_TYPE_LABELS } from "@/utils/constants/blood-type-labels";
import type { BloodTypeSelectProps } from "./BloodTypeSelect.types";

export function BloodTypeSelect({ control }: BloodTypeSelectProps) {
	return (
		<FormField
			control={control}
			name="bloodType"
			render={({ field }) => (
				<FormItem className="flex-1 min-w-[140px]">
					<FormLabel>Tipo sanguíneo</FormLabel>
					<Select
						onValueChange={(v) => field.onChange(v === "__none__" ? null : v)}
						value={field.value ?? "__none__"}
					>
						<FormControl>
							<SelectTrigger>
								<SelectValue placeholder="Selecione" />
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							<SelectItem value="__none__">Não informado</SelectItem>
							{Object.entries(BLOOD_TYPE_LABELS).map(([k, v]) => (
								<SelectItem key={k} value={k}>
									{v}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
