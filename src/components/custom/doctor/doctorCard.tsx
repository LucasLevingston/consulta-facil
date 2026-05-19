"use client";

import { FileCheck, Mail, Phone, Star, Stethoscope } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { DoctorResponse } from "@/lib/schemas/doctor.schema";
import { CustomButton } from "../custom-button";

interface DoctorCardProps {
	doctor: DoctorResponse;
	isActiveAppointmentButton?: boolean;
}

export default function DoctorCard({
	doctor,
	isActiveAppointmentButton = true,
}: DoctorCardProps) {
	const router = useRouter();

	const initials = doctor.name
		? doctor.name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.slice(0, 2)
				.toUpperCase()
		: "Dr";

	const rating = doctor.rating ?? null;
	const consultationCount = doctor.consultationCount ?? 0;

	return (
		<Card className="w-full flex flex-col hover:shadow-md transition-shadow duration-200">
			<CardHeader className="flex flex-row items-center gap-4 pb-3">
				<Avatar className="size-14 rounded-xl border border-border">
					<AvatarImage src={doctor.imageUrl ?? undefined} alt={doctor.name ?? "Médico"} />
					<AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold text-sm">
						{initials}
					</AvatarFallback>
				</Avatar>
				<div className="min-w-0 flex-1">
					<Link href={`/professionals/${doctor.id}`}>
						<CardTitle className="text-base leading-tight hover:text-primary transition-colors truncate">
							Dr. {doctor.name ?? "Nome não informado"}
						</CardTitle>
					</Link>
					<Badge variant="secondary" className="mt-1.5 text-xs">
						{doctor.specialty ?? "Especialidade não informada"}
					</Badge>
				</div>
			</CardHeader>

			<CardContent className="grid gap-2 flex-1 pb-3">
				{rating !== null && (
					<div className="flex items-center gap-2 text-sm">
						<Star className="size-3.5 shrink-0 fill-amber-400 text-amber-400" />
						<span className="font-medium text-foreground">{rating.toFixed(1)}</span>
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

			{isActiveAppointmentButton && (
				<CardFooter className="pt-0">
					<CustomButton
						className="w-full"
						onClick={() =>
							router.push(`/dashboard/appointments/create?doctorid=${doctor.id}`)
						}
					>
						<Stethoscope className="size-4" />
						Agendar Consulta
					</CustomButton>
				</CardFooter>
			)}
		</Card>
	);
}
