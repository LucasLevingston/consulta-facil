"use client";

import { GraduationCap, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EducationItem } from "./EducationDialog.types";

interface Props {
	edu: EducationItem;
	onEdit: (item: EducationItem) => void;
	onDelete: (id: string) => void;
	deleting: boolean;
}

export function EducationListItem({ edu, onEdit, onDelete, deleting }: Props) {
	return (
		<li className="flex items-start justify-between gap-4 rounded-lg border p-3">
			<div className="flex items-start gap-3">
				<GraduationCap className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
				<div>
					<p className="text-sm font-medium">{edu.institution}</p>
					<p className="text-xs text-muted-foreground">
						{edu.degree}
						{edu.fieldOfStudy ? ` — ${edu.fieldOfStudy}` : ""}
						{edu.graduationYear ? ` (${edu.graduationYear})` : ""}
					</p>
				</div>
			</div>
			<div className="flex gap-1 shrink-0">
				<Button
					size="icon"
					variant="ghost"
					className="h-7 w-7"
					onClick={() => onEdit(edu)}
				>
					<Pencil className="h-3.5 w-3.5" />
				</Button>
				<Button
					size="icon"
					variant="ghost"
					className="h-7 w-7 text-destructive hover:text-destructive"
					onClick={() => edu.id && onDelete(edu.id)}
					disabled={deleting}
				>
					<Trash2 className="h-3.5 w-3.5" />
				</Button>
			</div>
		</li>
	);
}
