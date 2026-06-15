"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import PageHeader from "@/components/custom/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { useCreateDependent } from "@/hooks/api/dependents/use-create-dependent";
import { useDeleteDependent } from "@/hooks/api/dependents/use-delete-dependent";
import { useMyDependents } from "@/hooks/api/dependents/use-my-dependents";
import { useUpdateDependent } from "@/hooks/api/dependents/use-update-dependent";
import {
	type CreateDependentInput,
	createDependentSchema,
} from "@/lib/schemas/dependent/create-dependent.schema";
import type { DependentResponse } from "@/lib/schemas/dependent/dependent-response.schema";

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

function calcAge(birthDate?: string | null) {
	if (!birthDate) return null;
	const birth = new Date(birthDate);
	const now = new Date();
	const age = now.getFullYear() - birth.getFullYear();
	const m = now.getMonth() - birth.getMonth();
	return m < 0 || (m === 0 && now.getDate() < birth.getDate()) ? age - 1 : age;
}

interface DependentFormDialogProps {
	open: boolean;
	onClose: () => void;
	editing?: DependentResponse | null;
}

function DependentFormDialog({
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

export default function DependentsPage() {
	const { data: dependents = [], isLoading } = useMyDependents();
	const deleteMutation = useDeleteDependent();

	const [dialogOpen, setDialogOpen] = useState(false);
	const [editing, setEditing] = useState<DependentResponse | null>(null);

	function openCreate() {
		setEditing(null);
		setDialogOpen(true);
	}

	function openEdit(dep: DependentResponse) {
		setEditing(dep);
		setDialogOpen(true);
	}

	async function handleDelete(id: string) {
		try {
			await deleteMutation.mutateAsync(id);
			toast.success("Dependente removido.");
		} catch {
			toast.error("Erro ao remover dependente.");
		}
	}

	return (
		<div className="space-y-6">
			<PageHeader
				title="Meus Dependentes"
				description="Gerencie filhos e outros dependentes vinculados à sua conta."
				icon={<Users className="h-5 w-5 sm:h-6 sm:w-6" />}
			/>
			<div className="flex justify-end">
				<Button onClick={openCreate} size="sm">
					<Plus className="h-4 w-4" />
					Adicionar dependente
				</Button>
			</div>

			{isLoading && (
				<div className="space-y-3">
					{[1, 2].map((i) => (
						<Card key={i}>
							<CardContent className="p-4">
								<div className="h-5 w-40 rounded bg-muted animate-pulse" />
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{!isLoading && dependents.length === 0 && (
				<div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
					<Users className="h-12 w-12 opacity-30" />
					<p className="text-sm">Nenhum dependente cadastrado.</p>
					<Button variant="outline" size="sm" onClick={openCreate}>
						<Plus className="h-4 w-4" />
						Adicionar primeiro dependente
					</Button>
				</div>
			)}

			<div className="space-y-3">
				{dependents.map((dep) => {
					const age = calcAge(dep.birthDate);
					return (
						<Card key={dep.id}>
							<CardContent className="flex items-center justify-between gap-4 p-4">
								<div className="space-y-1">
									<div className="flex items-center gap-2">
										<span className="font-medium">{dep.name}</span>
										<Badge variant="secondary">
											{RELATIONSHIP_LABELS[dep.relationship] ??
												dep.relationship}
										</Badge>
									</div>
									<p className="text-xs text-muted-foreground">
										{[
											dep.cpf ?? "Sem CPF",
											age != null ? `${age} anos` : null,
											dep.gender ? GENDER_LABELS[dep.gender] : null,
										]
											.filter(Boolean)
											.join("  •  ")}
									</p>
								</div>
								<div className="flex gap-2 shrink-0">
									<Button
										size="icon"
										variant="ghost"
										onClick={() => openEdit(dep)}
									>
										<Pencil className="h-4 w-4" />
									</Button>
									<Button
										size="icon"
										variant="ghost"
										className="text-destructive hover:text-destructive"
										onClick={() => handleDelete(dep.id)}
										disabled={deleteMutation.isPending}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			<DependentFormDialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
				editing={editing}
			/>
		</div>
	);
}
