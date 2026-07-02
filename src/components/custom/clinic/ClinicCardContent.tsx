import { MapPin, Phone, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import type { ClinicResponse } from "@/features/clinics";
import { SPECIALTY_LABELS } from "@/utils/constants/profession-specialties";

interface Props {
	clinic: ClinicResponse;
}

export function ClinicCardContent({ clinic }: Props) {
	const memberCount = clinic.members?.length ?? 0;
	return (
		<CardContent className="grid flex-1 gap-2 pb-3">
			{clinic.description && (
				<p className="line-clamp-2 text-sm text-muted-foreground">
					{clinic.description}
				</p>
			)}
			{clinic.address && (
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<MapPin className="size-3.5 shrink-0" />
					<span className="truncate">{clinic.address}</span>
				</div>
			)}
			{clinic.phone && (
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Phone className="size-3.5 shrink-0" />
					<span>{clinic.phone}</span>
				</div>
			)}
			{memberCount > 0 && (
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Users className="size-3.5 shrink-0" />
					<span>
						{memberCount} profissional{memberCount !== 1 ? "is" : ""}
					</span>
				</div>
			)}
			{clinic.members && clinic.members.length > 0 && (
				<div className="mt-1 flex flex-wrap gap-1">
					{clinic.members.slice(0, 3).map((m) => (
						<Badge
							key={m.professionalProfileId}
							variant="secondary"
							className="text-xs"
						>
							{SPECIALTY_LABELS[m.specialty] ?? m.specialty}
						</Badge>
					))}
					{clinic.members.length > 3 && (
						<Badge variant="outline" className="text-xs">
							+{clinic.members.length - 3}
						</Badge>
					)}
				</div>
			)}
		</CardContent>
	);
}
