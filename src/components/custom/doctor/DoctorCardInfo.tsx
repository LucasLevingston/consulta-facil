import { FileCheck, Mail, Phone, Star } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import type { DoctorCardProps } from "./doctorCard.types";

interface Props {
	doctor: DoctorCardProps["doctor"];
}

export function DoctorCardInfo({ doctor }: Props) {
	const rating = doctor.rating ?? null;
	const consultationCount = doctor.consultationCount ?? 0;
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
			{doctor.phone && (
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Phone className="size-3.5 shrink-0" />
					<span className="truncate">{doctor.phone}</span>
				</div>
			)}
			{doctor.email && (
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Mail className="size-3.5 shrink-0" />
					<span className="truncate">{doctor.email}</span>
				</div>
			)}
			{doctor.licenseNumber && (
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<FileCheck className="size-3.5 shrink-0" />
					<span>CRM: {doctor.licenseNumber}</span>
				</div>
			)}
		</CardContent>
	);
}
