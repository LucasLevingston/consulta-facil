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
import { RELATIONSHIP_LABELS } from "@/utils/constants/relationship-labels";
import type { RelationshipFieldProps } from "./RelationshipField.types";

export function RelationshipField({ control }: RelationshipFieldProps) {
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
