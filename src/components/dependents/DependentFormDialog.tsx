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
import {
	type CreateDependentInput,
	createDependentSchema,
	useCreateDependent,
	useUpdateDependent,
} from "@/features/dependents";
import type { DependentFormDialogProps } from "./DependentFormDialog.types";

const RELATIONSHIP_LABELS: Record<string, string> = {
	CHILD: "Filho(a)",
	SPOUSE: "Cônjuge",
	SIBLING: "Irmão(ã)",
	PARENT: "Pai/Mãe",
	OTHER: "Outro",
};

const GENDER_LABELS: Record<string, string> = {
	MALE: "Masculino",
	FEMALE: "Feminino",
	OTHER: "Outro",
};

export function DependentFormDialog({
	open,
	onClose,
	editing,
}: DependentFormDialogProps) {
	const create = useCreateDependent();
	const update = useUpdateDependent();

	const form = useForm<CreateDependentInput>({
		resolver: zodResolver(createDependentSchema),
		defaultValues: {
			name: editing?.name ?? "",
			cpf: editing?.cpf ?? "",
			birthDate: editing?.birthDate ?? "",
			gender: (editing?.gender as CreateDependentInput["gender"]) ?? undefined,
			relationship:
				(editing?.relationship as CreateDependentInput["relationship"]) ??
				undefined,
		},
	});

	async function onSubmit(data: CreateDependentInput) {
		try {
			if (editing) {
				await update.mutateAsync({ id: editing.id, data });
				toast.success("Dependente atualizado.");
			} else {
				await create.mutateAsync(data);
				toast.success("Dependente adicionado.");
			}
			form.reset();
			onClose();
		} catch {
			toast.error("Erro ao salvar dependente.");
		}
	}

	const isPending = create.isPending || update.isPending;

	return (
		<Dialog open={open} onOpenChange={(v) => !v && onClose()}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>
						{editing ? "Editar dependente" : "Adicionar dependente"}
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nome *</FormLabel>
									<FormControl>
										<Input placeholder="Nome completo" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="relationship"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Relação *</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
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
							control={form.control}
							name="cpf"
							render={({ field }) => (
								<FormItem>
									<FormLabel>CPF (opcional)</FormLabel>
									<FormControl>
										<Input placeholder="000.000.000-00" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="birthDate"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Data de nascimento (opcional)</FormLabel>
									<FormControl>
										<Input type="date" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="gender"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Gênero (opcional)</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Selecione" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{Object.entries(GENDER_LABELS).map(([k, v]) => (
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
						<div className="flex justify-end gap-2 pt-2">
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
