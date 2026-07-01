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
import type { UpdateAddressInput } from "@/features/professionals";

interface Props {
	control: Control<UpdateAddressInput>;
}

export function AddressCityFields({ control }: Props) {
	return (
		<>
			<div className="flex gap-4">
				<FormField
					control={control}
					name="neighborhood"
					render={({ field }) => (
						<FormItem className="flex-1">
							<FormLabel>Bairro</FormLabel>
							<FormControl>
								<Input
									placeholder="Bairro"
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
					name="complement"
					render={({ field }) => (
						<FormItem className="flex-1">
							<FormLabel>Complemento</FormLabel>
							<FormControl>
								<Input
									placeholder="Sala 1, Andar 2..."
									{...field}
									value={field.value ?? ""}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
			<div className="flex gap-4">
				<FormField
					control={control}
					name="city"
					render={({ field }) => (
						<FormItem className="flex-1">
							<FormLabel>Cidade</FormLabel>
							<FormControl>
								<Input
									placeholder="São Paulo"
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
					name="state"
					render={({ field }) => (
						<FormItem className="w-24">
							<FormLabel>Estado</FormLabel>
							<FormControl>
								<Input
									placeholder="SP"
									maxLength={2}
									{...field}
									value={field.value ?? ""}
									className="uppercase"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
		</>
	);
}
