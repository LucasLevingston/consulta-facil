"use client";

import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { PatientVaccineInput } from "@/features/patients";
import { VaccineOptionalFields } from "./VaccineOptionalFields";

interface Props {
	form: UseFormReturn<PatientVaccineInput>;
	isPending: boolean;
	onSubmit: (data: PatientVaccineInput) => void;
	onClose: () => void;
}

export function VaccineDialogForm({
	form,
	isPending,
	onSubmit,
	onClose,
}: Props) {
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="vaccineName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nome da vacina</FormLabel>
							<FormControl>
								<Input
									placeholder="COVID-19, Influenza, Tétano..."
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<VaccineOptionalFields form={form} />
				<div className="flex justify-end gap-2">
					<Button type="button" variant="outline" onClick={onClose}>
						Cancelar
					</Button>
					<Button type="submit" disabled={isPending}>
						{isPending ? "Salvando..." : "Salvar"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
