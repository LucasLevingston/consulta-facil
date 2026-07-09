"use client";

import { Briefcase, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ExperienceItem } from "./ExperienceDialog.types";

interface Props {
	exp: ExperienceItem;
	onEdit: (item: ExperienceItem) => void;
	onDelete: (id: string) => void;
	deleting: boolean;
}

export function ExperienceListItem({ exp, onEdit, onDelete, deleting }: Props) {
	return (
		<li className="flex items-start justify-between gap-4 rounded-lg border p-3">
			<div className="flex items-start gap-3">
				<Briefcase className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
				<div>
					<p className="text-sm font-medium">{exp.position}</p>
					<p className="text-xs text-muted-foreground">
						{exp.institution} · {exp.startYear}
						{exp.endYear ? `–${exp.endYear}` : "–atual"}
					</p>
					{exp.description && (
						<p className="text-xs text-muted-foreground mt-1">
							{exp.description}
						</p>
					)}
				</div>
			</div>
			<div className="flex gap-1 shrink-0">
				<Button
					size="icon"
					variant="ghost"
					className="h-7 w-7"
					onClick={() => onEdit(exp)}
				>
					<Pencil className="h-3.5 w-3.5" />
				</Button>
				<Button
					size="icon"
					variant="ghost"
					className="h-7 w-7 text-destructive hover:text-destructive"
					onClick={() => exp.id && onDelete(exp.id)}
					disabled={deleting}
				>
					<Trash2 className="h-3.5 w-3.5" />
				</Button>
			</div>
		</li>
	);
}
