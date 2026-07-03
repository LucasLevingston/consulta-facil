import { FileCheck, Mail, Phone, Star } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import type { ProfessionalResponse } from "@/features/professionals";

interface Props {
	professional: ProfessionalResponse;
}

export function ProfessionalCardInfo({ professional }: Props) {
	const rating = professional.rating ?? null;
	const consultationCount = professional.consultationCount ?? 0;
	return (
		<CardContent className="grid flex-1 gap-2 pb-3">
			{rating !== null && (
				<div className="flex items-center gap-2 text-sm">
					<Star className="size-3.5 shrink-0 fill-amber-400 text-amber-400" />
					<span className="font-medium text-foreground">
						{rating.toFixed(1)}
					</span>
					<span className="text-muted-foreground">
						· {consultationCount} consulta{consultationCount !== 1 ? "s" : ""}
					</span>
				</div>
			)}
			{professional.phone && (
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Phone className="size-3.5 shrink-0" />
					<span className="truncate">{professional.phone}</span>
				</div>
			)}
			{professional.email && (
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Mail className="size-3.5 shrink-0" />
					<span className="truncate">{professional.email}</span>
				</div>
			)}
			{professional.licenseNumber && (
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<FileCheck className="size-3.5 shrink-0" />
					<span>CRM: {professional.licenseNumber}</span>
				</div>
			)}
		</CardContent>
	);
}
