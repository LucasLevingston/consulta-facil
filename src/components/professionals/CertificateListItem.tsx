"use client";

import { Award, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CertificateItem } from "./CertificateDialog.types";

interface Props {
	cert: CertificateItem;
	onEdit: (item: CertificateItem) => void;
	onDelete: (id: string) => void;
	deleting: boolean;
}

export function CertificateListItem({
	cert,
	onEdit,
	onDelete,
	deleting,
}: Props) {
	return (
		<li className="flex items-start justify-between gap-4 rounded-lg border p-3">
			<div className="flex items-start gap-3">
				<Award className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
				<div>
					<div className="flex items-center gap-1">
						<p className="text-sm font-medium">{cert.title}</p>
						{cert.certificateUrl && (
							<a
								href={cert.certificateUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary"
							>
								<ExternalLink className="h-3 w-3" />
							</a>
						)}
					</div>
					<p className="text-xs text-muted-foreground">
						{cert.issuingOrganization}
						{cert.issueYear ? ` · ${cert.issueYear}` : ""}
					</p>
				</div>
			</div>
			<div className="flex gap-1 shrink-0">
				<Button
					size="icon"
					variant="ghost"
					className="h-7 w-7"
					onClick={() => onEdit(cert)}
				>
					<Pencil className="h-3.5 w-3.5" />
				</Button>
				<Button
					size="icon"
					variant="ghost"
					className="h-7 w-7 text-destructive hover:text-destructive"
					onClick={() => cert.id && onDelete(cert.id)}
					disabled={deleting}
				>
					<Trash2 className="h-3.5 w-3.5" />
				</Button>
			</div>
		</li>
	);
}
