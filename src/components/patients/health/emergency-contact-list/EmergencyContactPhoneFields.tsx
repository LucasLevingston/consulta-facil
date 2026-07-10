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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	type EmergencyContactInput,
	RELATIONSHIP_LABELS,
} from "@/features/patients";

interface Props {
	control: Control<EmergencyContactInput>;
}

export function EmergencyContactPhoneFields({ control }: Props) {
	return (
		<div className="flex gap-4">
			<FormField
				control={control}
				name="relationship"
				render={({ field }) => (
					<FormItem className="flex-1">
						<FormLabel>Parentesco</FormLabel>
						<Select onValueChange={field.onChange} value={field.value ?? ""}>
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
			<FormField
				control={control}
				name="phone"
				render={({ field }) => (
					<FormItem className="flex-1">
						<FormLabel>Telefone</FormLabel>
						<FormControl>
							<Input placeholder="(11) 99999-0000" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
