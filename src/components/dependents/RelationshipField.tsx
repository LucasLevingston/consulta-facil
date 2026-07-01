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
import type { CreateDependentInput } from "@/features/dependents";
import { RELATIONSHIP_LABELS } from "@/utils/constants/relationship-labels";

interface Props {
	control: Control<CreateDependentInput>;
}

export function RelationshipField({ control }: Props) {
	return (
		<FormField
			control={control}
			name="relationship"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Relação *</FormLabel>
					<Select onValueChange={field.onChange} defaultValue={field.value}>
						<FormControl>
							<SelectTrigger>
								<SelectValue placeholder="Selecione" />
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							{Object.entries(RELATIONSHIP_LABELS).map(([k, v]) => (
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
