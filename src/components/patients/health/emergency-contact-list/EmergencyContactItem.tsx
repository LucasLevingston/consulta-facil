"use client";

import { Pencil, Phone, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RELATIONSHIP_LABELS } from "@/features/patients";
import type { ContactItem } from "./EmergencyContactDialog";

interface Props {
	contact: ContactItem;
	onEdit: (item: ContactItem) => void;
	onDelete: (id: string) => void;
	isDeleting: boolean;
}

export function EmergencyContactItem({
	contact: c,
	onEdit,
	onDelete,
	isDeleting,
}: Props) {
	return (
		<li className="flex items-start justify-between gap-4 rounded-lg border p-3">
			<div className="flex items-start gap-3">
				<Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
				<div>
					<p className="text-sm font-medium">
						{c.name}
						{c.relationship && (
							<span className="ml-2 text-xs text-muted-foreground">
								{RELATIONSHIP_LABELS[c.relationship] ?? c.relationship}
							</span>
						)}
					</p>
					<p className="text-xs text-muted-foreground">
						{c.phone}
						{c.email ? ` · ${c.email}` : ""}
					</p>
				</div>
			</div>
			<div className="flex shrink-0 gap-1">
				<Button
					size="icon"
					variant="ghost"
					className="h-7 w-7"
					onClick={() => onEdit(c)}
				>
					<Pencil className="h-3.5 w-3.5" />
				</Button>
				<Button
					size="icon"
					variant="ghost"
					className="h-7 w-7 text-destructive hover:text-destructive"
					onClick={() => c.id && onDelete(c.id)}
					disabled={isDeleting}
				>
					<Trash2 className="h-3.5 w-3.5" />
				</Button>
			</div>
		</li>
	);
}
