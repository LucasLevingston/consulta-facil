"use client";

import { Building2, MapPin, Phone } from "lucide-react";
import { useParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClinicById } from "@/hooks/api/use-clinics";
import { useApplicationStatus } from "@/hooks/api/use-doctors";
import { QueryBoundary } from "@/providers/query-boundary";
import { useUserStore } from "@/store/useUserStore";

import { ClinicAppointmentsTab } from "./_components/ClinicAppointmentsTab";
import { ClinicFinancialTab } from "./_components/ClinicFinancialTab";
import { ClinicMembersTab } from "./_components/ClinicMembersTab";
import { ClinicOverviewTab } from "./_components/ClinicOverviewTab";

export default function ClinicDetailPage() {
	const params = useParams();
	const clinicId = params.id as string;

	const user = useUserStore((s) => s.user);
	const { data: clinic, isLoading, error } = useClinicById(clinicId);
	const { data: myDoctorProfile } = useApplicationStatus();

	const isOwner = !!user && clinic?.ownerId === user.id;
	const isAdmin = user?.role === "ADMIN";
	const isManager = isOwner || isAdmin;

	const myMembership = clinic?.members?.find(
		(m) => m.professionalProfileId === myDoctorProfile?.id,
	);
	const isMember = !!myMembership || isManager;

	return (
		<QueryBoundary isLoading={isLoading} error={error}>
			{clinic && (
				<div className="space-y-6">
					{/* Header */}
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

							<div className="flex items-center gap-2 shrink-0">
								<Badge
									variant="outline"
									className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400"
								>
									{clinic.status === "ACTIVE" ? "Ativa" : clinic.status}
								</Badge>
								{isOwner && <Badge variant="secondary">Proprietário</Badge>}
								{isAdmin && !isOwner && (
									<Badge variant="secondary">Admin</Badge>
								)}
								{myMembership && !isOwner && (
									<Badge variant="outline">Membro</Badge>
								)}
							</div>
						</div>
					</div>

					{/* Tabs */}
					<Tabs defaultValue="overview" className="space-y-4">
						<TabsList className="flex-wrap h-auto gap-1">
							<TabsTrigger value="overview">Visão Geral</TabsTrigger>
							<TabsTrigger value="members">
								Médicos ({clinic.members?.length ?? 0})
							</TabsTrigger>
							{isMember && (
								<TabsTrigger value="appointments">Consultas</TabsTrigger>
							)}
							{isManager && (
								<TabsTrigger value="financial">Financeiro</TabsTrigger>
							)}
						</TabsList>

						<TabsContent value="overview">
							<ClinicOverviewTab clinic={clinic} />
						</TabsContent>

						<TabsContent value="members">
							<ClinicMembersTab
								clinic={clinic}
								isManager={isManager}
								currentUserId={user?.id}
							/>
						</TabsContent>

						{isMember && (
							<TabsContent value="appointments">
								<ClinicAppointmentsTab
									clinic={clinic}
									isManager={isManager}
									myProfessionalProfileId={myDoctorProfile?.id}
								/>
							</TabsContent>
						)}

						{isManager && (
							<TabsContent value="financial">
								<ClinicFinancialTab clinic={clinic} />
							</TabsContent>
						)}
					</Tabs>
				</div>
			)}
		</QueryBoundary>
	);
}
