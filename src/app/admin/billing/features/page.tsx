"use client";

import { Plus, Tag } from "lucide-react";
import { FeaturesTable } from "@/components/admin/billing/FeaturesTable";
import PageHeader from "@/components/custom/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useBillingFeaturesPage } from "@/features/billing/hooks/use-billing-features-page";

export default function AdminFeaturesPage() {
	const {
		features,
		isLoading,
		newKey,
		setNewKey,
		newName,
		setNewName,
		handleCreate,
		handleDelete,
		creating,
		deleting,
	} = useBillingFeaturesPage();

	return (
		<div className="space-y-6 p-6">
			<PageHeader
				title="Features"
				description="Recursos disponíveis nos planos de assinatura."
				count={features.length}
				countLabel="recurso"
				icon={<Tag className="h-6 w-6" />}
			/>

			<div className="flex gap-2 items-end">
				<div className="space-y-1">
					<label
						htmlFor="feature-key"
						className="text-xs text-muted-foreground"
					>
						Chave
					</label>
					<Input
						id="feature-key"
						placeholder="CONSULTATIONS"
						value={newKey}
						onChange={(e) => setNewKey(e.target.value.toUpperCase())}
						className="w-48"
					/>
				</div>
				<div className="space-y-1">
					<label
						htmlFor="feature-name"
						className="text-xs text-muted-foreground"
					>
						Nome
					</label>
					<Input
						id="feature-name"
						placeholder="Consultas mensais"
						value={newName}
						onChange={(e) => setNewName(e.target.value)}
						className="w-64"
					/>
				</div>
				<Button
					onClick={handleCreate}
					disabled={creating || !newKey || !newName}
				>
					<Plus className="h-4 w-4 mr-1" />
					Adicionar
				</Button>
			</div>

			{isLoading ? (
				<Skeleton className="h-64 w-full" />
			) : (
				<FeaturesTable
					features={features}
					handleDelete={handleDelete}
					deleting={deleting}
				/>
			)}
		</div>
	);
}
