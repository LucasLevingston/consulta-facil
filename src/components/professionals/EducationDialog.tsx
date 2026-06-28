"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
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
import { useAddEducation } from "@/hooks/api/professionals/use-add-education";
import { useUpdateEducation } from "@/hooks/api/professionals/use-update-education";
import {
	degreeTypeOptions,
	type ProfessionalEducationInput,
	professionalEducationSchema,
} from "@/lib/schemas/doctor/professional-education.schema";
import type { ProfessionalResponse } from "@/lib/schemas/doctor/professional-response.schema";

type EducationItem = NonNullable<ProfessionalResponse["education"]>[number];

interface Props {
	open: boolean;
	onClose: () => void;
	editing?: EducationItem;
}

export function EducationDialog({ open, onClose, editing }: Props) {
	const add = useAddEducation();
	const update = useUpdateEducation();

	const form = useForm<ProfessionalEducationInput>({
		resolver: zodResolver(professionalEducationSchema),
		defaultValues: {
			degree: editing?.degree ?? "",
			institution: editing?.institution ?? "",
			fieldOfStudy: editing?.fieldOfStudy ?? "",
			graduationYear: editing?.graduationYear ?? undefined,
		},
	});

	function onSubmit(data: ProfessionalEducationInput) {
		if (editing?.id) {
			update.mutate(
				{ educationId: editing.id, data },
				{
					onSuccess: () => {
						toast.success("Formação atualizada!");
						onClose();
					},
					onError: () => toast.error("Erro ao atualizar."),
				},
			);
		} else {
			add.mutate(data, {
				onSuccess: () => {
					toast.success("Formação adicionada!");
					onClose();
				},
				onError: () => toast.error("Erro ao adicionar."),
			});
		}
	}

	const isPending = add.isPending || update.isPending;

	return (
		<Dialog open={open} onOpenChange={(o) => !o && onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{editing ? "Editar formação" : "Nova formação"}
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="degree"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Grau</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Selecione" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{degreeTypeOptions.map((opt) => (
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
			</DialogContent>
		</Dialog>
	);
}
