"use client";

import { Building2, MapPin, Phone, Star, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ClinicResponse } from "@/lib/schemas/clinic.schema";

interface Props {
	clinic: ClinicResponse;
}

export function ClinicOverviewTab({ clinic }: Props) {
	const memberCount = clinic.members?.length ?? 0;
	const specialties = [
		...new Set(clinic.members?.map((m) => m.specialty) ?? []),
	];

	return (
		<div className="space-y-4">
			{/* Stat cards */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Médicos
						</CardTitle>
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
							<Users className="h-4 w-4 text-muted-foreground" />
						</div>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{memberCount}</p>
						<p className="mt-1 text-xs text-muted-foreground">
							profissional{memberCount !== 1 ? "is" : ""} cadastrado
							{memberCount !== 1 ? "s" : ""}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Especialidades
						</CardTitle>
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
							<Star className="h-4 w-4 text-muted-foreground" />
						</div>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{specialties.length}</p>
						<p className="mt-1 text-xs text-muted-foreground">
							área{specialties.length !== 1 ? "s" : ""} de atuação
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Proprietário
						</CardTitle>
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
							<Building2 className="h-4 w-4 text-muted-foreground" />
						</div>
					</CardHeader>
					<CardContent>
						<p className="text-sm font-semibold truncate">
							{clinic.ownerName ?? "—"}
						</p>
						<p className="mt-1 text-xs text-muted-foreground">
							responsável pela clínica
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Clinic info */}
			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-base">Informações da clínica</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{clinic.description && (
						<p className="text-sm text-muted-foreground">
							{clinic.description}
						</p>
					)}

					<div className="grid gap-3 sm:grid-cols-2">
						{clinic.address && (
							<div className="flex items-start gap-2 text-sm">
								<MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
								<div>
									<p className="text-xs text-muted-foreground">Endereço</p>
									<p className="font-medium">{clinic.address}</p>
									{clinic.city && (
										<p className="text-xs text-muted-foreground">
											{clinic.city}
											{clinic.state ? `, ${clinic.state}` : ""}
											{clinic.zipCode ? ` — ${clinic.zipCode}` : ""}
										</p>
									)}
								</div>
							</div>
						)}

						{clinic.phone && (
							<div className="flex items-start gap-2 text-sm">
								<Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
								<div>
									<p className="text-xs text-muted-foreground">Telefone</p>
									<p className="font-medium">{clinic.phone}</p>
								</div>
							</div>
						)}
					</div>

					{specialties.length > 0 && (
						<div>
							<p className="mb-2 text-xs text-muted-foreground">
								Especialidades disponíveis
							</p>
							<div className="flex flex-wrap gap-1.5">
								{specialties.map((s) => (
									<Badge key={s} variant="secondary">
										{s}
									</Badge>
								))}
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
