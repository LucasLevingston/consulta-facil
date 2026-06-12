"use client";

import {
	Calendar,
	FileCheck,
	Mail,
	Phone,
	Star,
	Stethoscope,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useProfessional } from "@/hooks/api/doctors/use-professional";
import { QueryBoundary } from "@/providers/query-boundary";
import { SPECIALTY_LABELS } from "@/utils/constants/profession-specialties";

export default function DoctorProfilePage() {
	const { id } = useParams<{ id: string }>();
	const router = useRouter();
	const { data: doctor, isLoading, error } = useProfessional(id);

	if (!doctor) {
		return (
			<div className="flex flex-col items-center justify-center py-24 text-center gap-4">
				<Stethoscope className="h-12 w-12 text-muted-foreground/40" />
				<h2 className="text-xl font-semibold">Profissional não encontrado</h2>
				<p className="text-muted-foreground text-sm">
					O profissional que você está procurando não existe ou foi removido.
				</p>
				<Button variant="outline" onClick={() => router.push("/professionals")}>
					Ver todos os profissionais
				</Button>
			</div>
		);
	}

	const initials = doctor.name
		? doctor.name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.slice(0, 2)
				.toUpperCase()
		: "?";

	return (
		<QueryBoundary isLoading={isLoading} error={error}>
			{/* Hero card */}
			<Card className="overflow-hidden">
				<div className="h-24 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20" />
				<CardContent className="relative pt-0 pb-6 px-6">
					<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10">
						<Avatar className="size-20 rounded-2xl border-4 border-card shadow-md">
							<AvatarImage
								src={doctor.imageUrl ?? undefined}
								alt={doctor.name ?? "Profissional"}
							/>
							<AvatarFallback className="rounded-2xl bg-primary/15 text-primary font-bold text-2xl">
								{initials}
							</AvatarFallback>
						</Avatar>
						<Button
							onClick={() =>
								router.push(
									`/dashboard/appointments/create?doctorid=${doctor.id}`,
								)
							}
							className="gap-2 shrink-0"
						>
							<Calendar className="h-4 w-4" />
							Agendar consulta
						</Button>
					</div>

					<div className="mt-4 space-y-2">
						<div className="flex flex-wrap items-center gap-2">
							<h1 className="text-2xl font-bold">{doctor.name}</h1>
							<Badge className="gap-1">
								<Star className="h-3 w-3 fill-current" />
								Verificado
							</Badge>
						</div>
						{doctor.specialty && (
							<Badge variant="secondary" className="text-sm px-3 py-1">
								{SPECIALTY_LABELS[doctor.specialty] ?? doctor.specialty}
							</Badge>
						)}
						{doctor.rating != null && (
							<div className="flex items-center gap-2 text-sm pt-1">
								<div className="flex gap-0.5">
									{[1, 2, 3, 4, 5].map((n) => (
										<Star
											key={n}
											className={`h-4 w-4 ${n <= Math.round(doctor.rating ?? 0) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
										/>
									))}
								</div>
								<span className="font-semibold text-foreground">
									{doctor.rating.toFixed(1)}
								</span>
								{doctor.consultationCount != null &&
									doctor.consultationCount > 0 && (
										<span className="text-muted-foreground">
											· {doctor.consultationCount} consulta
											{doctor.consultationCount !== 1 ? "s" : ""}
										</span>
									)}
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Contact info */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Informações de contato</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					{doctor.email && (
						<div className="flex items-center gap-3 text-sm">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
								<Mail className="h-4 w-4 text-primary" />
							</div>
							<div>
								<p className="text-xs text-muted-foreground">E-mail</p>
								<p className="font-medium">{doctor.email}</p>
							</div>
						</div>
					)}
					{doctor.phone && (
						<>
							<Separator />
							<div className="flex items-center gap-3 text-sm">
								<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
									<Phone className="h-4 w-4 text-primary" />
								</div>
								<div>
									<p className="text-xs text-muted-foreground">Telefone</p>
									<p className="font-medium">{doctor.phone}</p>
								</div>
							</div>
						</>
					)}
					{doctor.licenseNumber && (
						<>
							<Separator />
							<div className="flex items-center gap-3 text-sm">
								<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
									<FileCheck className="h-4 w-4 text-primary" />
								</div>
								<div>
									<p className="text-xs text-muted-foreground">Registro CRM</p>
									<p className="font-medium">{doctor.licenseNumber}</p>
								</div>
							</div>
						</>
					)}
				</CardContent>
			</Card>

			{/* Specialties & expertise */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Especialidade</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-2">
						{doctor.specialty ? (
							<Badge
								variant="secondary"
								className="px-4 py-2 text-sm rounded-full"
							>
								<Stethoscope className="h-3.5 w-3.5 mr-1.5" />
								{SPECIALTY_LABELS[doctor.specialty] ?? doctor.specialty}
							</Badge>
						) : (
							<p className="text-sm text-muted-foreground">
								Especialidade não informada.
							</p>
						)}
					</div>
				</CardContent>
			</Card>
		</QueryBoundary>
	);
}
