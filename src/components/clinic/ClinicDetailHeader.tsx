import { Building2, MapPin, Monitor, Phone } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ClinicResponse } from "@/lib/schemas/clinic/clinic-response.schema";

export function ClinicDetailHeader({
	clinic,
	clinicId,
	isOwner,
	isAdmin,
	hasMembership,
}: {
	clinic: ClinicResponse;
	clinicId: string;
	isOwner: boolean;
	isAdmin: boolean;
	hasMembership: boolean;
}) {
	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div className="flex items-start gap-3">
					<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
						<Building2 className="h-6 w-6" />
					</div>
					<div className="min-w-0">
						<h1 className="text-2xl font-bold tracking-tight text-foreground">
							{clinic.name}
						</h1>
						<div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
							{clinic.city && (
								<span className="flex items-center gap-1">
									<MapPin className="h-3.5 w-3.5" />
									{clinic.city}
									{clinic.state ? `, ${clinic.state}` : ""}
								</span>
							)}
							{clinic.phone && (
								<span className="flex items-center gap-1">
									<Phone className="h-3.5 w-3.5" />
									{clinic.phone}
								</span>
							)}
						</div>
					</div>
				</div>

				<div className="flex items-center gap-2 shrink-0 flex-wrap">
					<Button asChild variant="outline" size="sm" className="gap-1.5">
						<Link href={`/clinics/${clinicId}/queue`} target="_blank">
							<Monitor className="h-3.5 w-3.5" />
							Fila de Espera
						</Link>
					</Button>
					<Badge
						variant="outline"
						className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400"
					>
						{clinic.status === "ACTIVE" ? "Ativa" : clinic.status}
					</Badge>
					{isOwner && <Badge variant="secondary">Proprietário</Badge>}
					{isAdmin && !isOwner && <Badge variant="secondary">Admin</Badge>}
					{hasMembership && !isOwner && <Badge variant="outline">Membro</Badge>}
				</div>
			</div>
		</div>
	);
}
