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
import type { ProfessionalEducationInput } from "@/features/professionals";
import { EducationDegreeField } from "./EducationDegreeField";

interface Props {
	form: UseFormReturn<ProfessionalEducationInput>;
	onSubmit: (data: ProfessionalEducationInput) => void;
	isPending: boolean;
	onClose: () => void;
}

export function EducationDialogForm({
	form,
	onSubmit,
	isPending,
	onClose,
}: Props) {
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<EducationDegreeField control={form.control} />
				<FormField
					control={form.control}
					name="institution"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Instituição</FormLabel>
							<FormControl>
								<Input placeholder="USP, Unicamp..." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="fieldOfStudy"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Área</FormLabel>
							<FormControl>
								<Input
									placeholder="Medicina, Psicologia..."
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
					name="graduationYear"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ano de conclusão</FormLabel>
							<FormControl>
								<Input
									type="number"
									placeholder="2010"
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
