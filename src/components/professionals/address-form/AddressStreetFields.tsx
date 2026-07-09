"use client";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { AddressStreetFieldsProps } from "./AddressStreetFields.types";

export function AddressStreetFields({ control }: AddressStreetFieldsProps) {
	return (
		<div className="flex gap-4">
			<FormField
				control={control}
				name="zipCode"
				render={({ field }) => (
					<FormItem className="w-36">
						<FormLabel>CEP</FormLabel>
						<FormControl>
							<Input
								placeholder="00000-000"
								{...field}
								value={field.value ?? ""}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={control}
				name="address"
				render={({ field }) => (
					<FormItem className="flex-1">
						<FormLabel>Logradouro</FormLabel>
						<FormControl>
							<Input
								placeholder="Rua, Av..."
								{...field}
								value={field.value ?? ""}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={control}
				name="streetNumber"
				render={({ field }) => (
					<FormItem className="w-24">
						<FormLabel>Número</FormLabel>
						<FormControl>
							<Input placeholder="100" {...field} value={field.value ?? ""} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
