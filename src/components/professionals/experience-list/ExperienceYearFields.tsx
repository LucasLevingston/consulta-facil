"use client";

import type { Control } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { ProfessionalExperienceInput } from "@/features/professionals";

interface Props {
	control: Control<ProfessionalExperienceInput>;
}

export function ExperienceYearFields({ control }: Props) {
	return (
		<div className="flex gap-4">
			<FormField
				control={control}
				name="startYear"
				render={({ field }) => (
					<FormItem className="flex-1">
						<FormLabel>Ano início</FormLabel>
						<FormControl>
							<Input
								type="number"
								placeholder="2015"
								value={field.value ?? ""}
								onChange={(e) =>
									field.onChange(
										e.target.value === "" ? undefined : Number(e.target.value),
									)
								}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={control}
				name="endYear"
				render={({ field }) => (
					<FormItem className="flex-1">
						<FormLabel>Ano fim (deixe vazio se atual)</FormLabel>
						<FormControl>
							<Input
								type="number"
								placeholder="2020"
								value={field.value ?? ""}
								onChange={(e) =>
									field.onChange(
										e.target.value === "" ? null : Number(e.target.value),
									)
								}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
