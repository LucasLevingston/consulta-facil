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
import type { FeaturesTableProps } from "./FeaturesTable.types";

export function FeaturesTable({
	features,
	handleDelete,
	deleting,
}: FeaturesTableProps) {
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
				{features.map((f) => (
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
