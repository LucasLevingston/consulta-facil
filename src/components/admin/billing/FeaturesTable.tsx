"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { FeatureResponse } from "@/features/billing";

interface Props {
	features: FeatureResponse[];
	handleDelete: (id: string) => void;
	deleting: boolean;
}

export function FeaturesTable({ features, handleDelete, deleting }: Props) {
	return (
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
								onClick={() => handleDelete(f.id)}
								disabled={deleting}
							>
								<Trash2 className="h-4 w-4 text-destructive" />
							</Button>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
