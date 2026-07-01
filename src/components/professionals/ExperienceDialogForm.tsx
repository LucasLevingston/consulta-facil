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
import type { ProfessionalExperienceInput } from "@/features/professionals";
import { ExperienceYearFields } from "./ExperienceYearFields";

interface Props {
	form: UseFormReturn<ProfessionalExperienceInput>;
	onSubmit: (data: ProfessionalExperienceInput) => void;
	isPending: boolean;
	onClose: () => void;
}

export function ExperienceDialogForm({
	form,
	onSubmit,
	isPending,
	onClose,
}: Props) {
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="position"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Cargo</FormLabel>
							<FormControl>
								<Input
									placeholder="Cardiologista, Clínico Geral..."
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="institution"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Instituição</FormLabel>
							<FormControl>
								<Input placeholder="Hospital das Clínicas..." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<ExperienceYearFields control={form.control} />
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Descrição (opcional)</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Descreva suas atividades..."
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
