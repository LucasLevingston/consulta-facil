"use client";

import { Plus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import PageHeader from "@/components/custom/page-header";
import { DependentCard } from "@/components/dependents/DependentCard";
import { DependentFormDialog } from "@/components/dependents/DependentFormDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDeleteDependent } from "@/hooks/api/dependents/use-delete-dependent";
import { useMyDependents } from "@/hooks/api/dependents/use-my-dependents";
import type { DependentResponse } from "@/lib/schemas/dependent/dependent-response.schema";

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
				{dependents.map((dep) => (
					<DependentCard
						key={dep.id}
						dependent={dep}
						onEdit={openEdit}
						onDelete={handleDelete}
						deleting={deleteMutation.isPending}
					/>
				))}
			</div>

			<DependentFormDialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
				editing={editing}
			/>
		</div>
	);
}
