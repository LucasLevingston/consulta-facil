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
import { Textarea } from "@/components/ui/textarea";
import type { PatientVaccineInput } from "@/features/patients";

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
				<div className="flex gap-4">
					<FormField
						control={form.control}
						name="doseNumber"
						render={({ field }) => (
							<FormItem className="flex-1">
								<FormLabel>Dose (opcional)</FormLabel>
								<FormControl>
									<Input
										placeholder="1ª dose, reforço..."
										{...field}
										value={field.value ?? ""}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="administeredAt"
						render={({ field }) => (
							<FormItem className="flex-1">
								<FormLabel>Data (opcional)</FormLabel>
								<FormControl>
									<Input type="date" {...field} value={field.value ?? ""} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<FormField
					control={form.control}
					name="notes"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Observações (opcional)</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Reações, local de aplicação..."
									{...field}
									value={field.value ?? ""}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
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
