"use client";

import type { Control } from "react-hook-form";
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
import {
	degreeTypeOptions,
	type ProfessionalEducationInput,
} from "@/features/professionals";

interface Props {
	control: Control<ProfessionalEducationInput>;
}

export function EducationDegreeField({ control }: Props) {
	return (
		<FormField
			control={control}
			name="degree"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Grau</FormLabel>
					<Select onValueChange={field.onChange} value={field.value}>
						<FormControl>
							<SelectTrigger>
								<SelectValue placeholder="Selecione" />
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							{degreeTypeOptions.map((opt) => (
								<SelectItem key={opt.value} value={opt.value}>
									{opt.label}
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
