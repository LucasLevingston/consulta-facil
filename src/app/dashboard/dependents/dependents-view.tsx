"use client";

import { Plus, Users } from "lucide-react";
import PageHeader from "@/components/custom/page-header";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import { DependentCard } from "@/components/dependents/DependentCard";
import { DependentFormDialog } from "@/components/dependents/DependentFormDialog";
import { Button } from "@/components/ui/button";
import type { DependentResponse } from "@/features/dependents";
import { useMyDependents } from "@/features/dependents";
import { useDependentsPage } from "@/features/dependents/hooks/use-dependents-page";

function DependentsList({
	openEdit,
	onDelete,
	deleting,
	onAddFirst,
}: {
	openEdit: (dep: DependentResponse) => void;
	onDelete: (id: string) => void;
	deleting: boolean;
	onAddFirst: () => void;
}) {
	const { data: dependents } = useMyDependents();

	if (dependents.length === 0) {
		return (
			<div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
				<Users className="h-12 w-12 opacity-30" />
				<p className="text-sm">Nenhum dependente cadastrado.</p>
				<Button variant="outline" size="sm" onClick={onAddFirst}>
					<Plus className="h-4 w-4" />
					Adicionar primeiro dependente
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			{dependents.map((dep) => (
				<DependentCard
					key={dep.id}
					dependent={dep}
					onEdit={openEdit}
					onDelete={onDelete}
					deleting={deleting}
				/>
			))}
		</div>
	);
}

export function DependentsView() {
	const {
		dialogOpen,
		setDialogOpen,
		editing,
		openCreate,
		openEdit,
		handleDelete,
		deleting,
	} = useDependentsPage();

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

			<SuspenseBoundary>
				<DependentsList
					openEdit={openEdit}
					onDelete={handleDelete}
					deleting={deleting}
					onAddFirst={openCreate}
				/>
			</SuspenseBoundary>

			<DependentFormDialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
				editing={editing}
			/>
		</div>
	);
}
