"use client";

import { Plus, Tag, Trash2 } from "lucide-react";
import { useState } from "react";
import PageHeader from "@/components/custom/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	useCreateFeature,
	useDeleteFeature,
	useFeatures,
} from "@/hooks/api/billing/use-features";
import type { FeatureResponse } from "@/lib/schemas/billing/feature.schema";

export default function AdminFeaturesPage() {
	const { data: features = [], isLoading } = useFeatures();
	const createFeature = useCreateFeature();
	const deleteFeature = useDeleteFeature();

	const [newKey, setNewKey] = useState("");
	const [newName, setNewName] = useState("");

	function handleCreate() {
		if (!newKey || !newName) return;
		createFeature.mutate(
			{ key: newKey, name: newName },
			{
				onSuccess: () => {
					setNewKey("");
					setNewName("");
				},
			},
		);
	}

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
					disabled={createFeature.isPending || !newKey || !newName}
				>
					<Plus className="h-4 w-4 mr-1" />
					Adicionar
				</Button>
			</div>

			{isLoading ? (
				<Skeleton className="h-64 w-full" />
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Chave</TableHead>
							<TableHead>Nome</TableHead>
							<TableHead>Descrição</TableHead>
							<TableHead>Ações</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{features.map((f: FeatureResponse) => (
							<TableRow key={f.id}>
								<TableCell className="font-mono text-sm">{f.key}</TableCell>
								<TableCell>{f.name}</TableCell>
								<TableCell className="text-muted-foreground text-sm">
									{f.description ?? "—"}
								</TableCell>
								<TableCell>
									<Button
										size="icon"
										variant="ghost"
										onClick={() => deleteFeature.mutate(f.id)}
										disabled={deleteFeature.isPending}
									>
										<Trash2 className="h-4 w-4 text-destructive" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
}
