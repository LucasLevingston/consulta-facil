"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { DependentResponse } from "@/lib/schemas/dependent/dependent-response.schema";
import { useDeleteDependent } from "../hooks/use-delete-dependent";
import { useMyDependents } from "../hooks/use-my-dependents";

export function useDependentsController() {
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

	return {
		dependents,
		isLoading,
		dialogOpen,
		setDialogOpen,
		editing,
		openCreate,
		openEdit,
		handleDelete,
		deleting: deleteMutation.isPending,
	};
}
