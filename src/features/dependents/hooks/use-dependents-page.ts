"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { DependentResponse } from "@/features/dependents";
import { useDeleteDependent } from "@/features/dependents";

export function useDependentsPage() {
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
		dialogOpen,
		setDialogOpen,
		editing,
		openCreate,
		openEdit,
		handleDelete,
		deleting: deleteMutation.isPending,
	};
}
