"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

interface Props {
	dependent: DependentResponse;
	onEdit: (dep: DependentResponse) => void;
	onDelete: (id: string) => void;
	deleting: boolean;
}

export function DependentCard({
	dependent: dep,
	onEdit,
	onDelete,
	deleting,
}: Props) {
	const age = calcAge(dep.birthDate);
	return (
		<Card>
			<CardContent className="flex items-center justify-between gap-4 p-4">
				<div className="space-y-1">
					<div className="flex items-center gap-2">
						<span className="font-medium">{dep.name}</span>
						<Badge variant="secondary">
							{RELATIONSHIP_LABELS[dep.relationship] ?? dep.relationship}
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
					<Button size="icon" variant="ghost" onClick={() => onEdit(dep)}>
						<Pencil className="h-4 w-4" />
					</Button>
					<Button
						size="icon"
						variant="ghost"
						className="text-destructive hover:text-destructive"
						onClick={() => onDelete(dep.id)}
						disabled={deleting}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
