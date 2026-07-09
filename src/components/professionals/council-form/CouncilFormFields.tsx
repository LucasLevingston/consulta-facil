"use client";

import { Save } from "lucide-react";
import type { FormEventHandler } from "react";
import type { Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
	councilTypeOptions,
	type UpdateCouncilInput,
} from "@/features/professionals";

interface Props {
	control: Control<UpdateCouncilInput>;
	onSubmit: FormEventHandler<HTMLFormElement>;
	isPending: boolean;
}

export function CouncilFormFields({ control, onSubmit, isPending }: Props) {
	return (
		<form onSubmit={onSubmit} className="space-y-4">
			<div className="flex gap-4">
				<FormField
					control={control}
					name="councilType"
					render={({ field }) => (
						<FormItem className="flex-1">
							<FormLabel>Tipo</FormLabel>
							<Select onValueChange={field.onChange} value={field.value ?? ""}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Selecione" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{councilTypeOptions.map((opt) => (
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
				<FormField
					control={control}
					name="councilState"
					render={({ field }) => (
						<FormItem className="w-24">
							<FormLabel>UF</FormLabel>
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
			<Button type="submit" disabled={isPending} className="gap-2">
				<Save className="h-4 w-4" />
				{isPending ? "Salvando..." : "Salvar"}
			</Button>
		</form>
	);
}
