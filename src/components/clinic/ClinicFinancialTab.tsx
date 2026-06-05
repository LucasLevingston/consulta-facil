"use client";

import { useQueries } from "@tanstack/react-query";
import { CheckCircle2, Loader2, TrendingUp, Users, Zap } from "lucide-react";
import { useMemo } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { appointmentKeys } from "@/hooks/api/appointments/appointment-keys";
import { appointmentsApi } from "@/lib/api/appointments.api";
import type { ClinicResponse } from "@/lib/schemas/clinic/clinic-response.schema";
import {
	FREE_CONSULTS_PER_DOCTOR,
	FREE_DOCTORS,
} from "@/utils/constants/plan-limits";

interface Props {
	clinic: ClinicResponse;
}

export function ClinicFinancialTab({ clinic }: Props) {
	const members = clinic.members ?? [];

	const results = useQueries({
		queries: members.map((m) => ({
			queryKey: appointmentKeys.byProfessional(m.professionalProfileId),
			queryFn: () =>
				appointmentsApi.getByProfessional(m.professionalProfileId, 0, 100),
		})),
	});

	const isLoading = results.some((r) => r.isLoading);

	const memberStats = useMemo(
		() =>
			members.map((member, i) => {
				const appts = results[i]?.data?.content ?? [];
				const completed = appts.filter((a) => a.status === "COMPLETED").length;
				const freeUsed = Math.min(completed, FREE_CONSULTS_PER_DOCTOR);
				const paidCount = Math.max(0, completed - FREE_CONSULTS_PER_DOCTOR);
				return { member, completed, freeUsed, paidCount };
			}),
		[results, members],
	);

	const totalCompleted = memberStats.reduce((s, m) => s + m.completed, 0);
	const totalFreeUsed = memberStats.reduce((s, m) => s + m.freeUsed, 0);
	const totalFreeQuota = members.length * FREE_CONSULTS_PER_DOCTOR;
	const totalPaid = memberStats.reduce((s, m) => s + m.paidCount, 0);
	const extraDoctors = Math.max(0, members.length - FREE_DOCTORS);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-16">
				<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Summary stats */}
			<div className="grid gap-4 sm:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Consultas realizadas
						</CardTitle>
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
							<CheckCircle2 className="h-4 w-4 text-muted-foreground" />
						</div>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{totalCompleted}</p>
						<p className="mt-1 text-xs text-muted-foreground">
							consultas concluídas
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Cota gratuita
						</CardTitle>
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
							<Zap className="h-4 w-4 text-muted-foreground" />
						</div>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">
							{totalFreeUsed}
							<span className="text-base font-normal text-muted-foreground">
								/{totalFreeQuota}
							</span>
						</p>
						<p className="mt-1 text-xs text-muted-foreground">
							{Math.max(0, totalFreeQuota - totalFreeUsed)} restantes
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Profissionais extras
						</CardTitle>
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
							<Users className="h-4 w-4 text-muted-foreground" />
						</div>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{extraDoctors}</p>
						<p className="mt-1 text-xs text-muted-foreground">
							{extraDoctors === 0
								? "dentro do limite gratuito"
								: `+${extraDoctors * 20}% no plano`}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Free quota progress */}
			<Card>
				<CardHeader className="pb-3">
					<div className="flex items-center gap-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
							<TrendingUp className="h-4 w-4 text-primary" />
						</div>
						<div>
							<CardTitle className="text-base">Uso por profissional</CardTitle>
							<CardDescription>
								Cada profissional tem {FREE_CONSULTS_PER_DOCTOR} consultas
								gratuitas
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					{memberStats.map(({ member, completed, freeUsed, paidCount }) => (
						<div key={member.professionalProfileId}>
							<div className="flex items-center gap-3 mb-2">
								<Avatar className="h-7 w-7 shrink-0">
									<AvatarImage src={member.imageUrl ?? undefined} />
									<AvatarFallback className="text-xs">
										{member.professionalName?.slice(0, 2).toUpperCase() ?? "DR"}
									</AvatarFallback>
								</Avatar>
								<div className="flex-1 min-w-0">
									<div className="flex items-center justify-between">
										<p className="text-sm font-medium truncate">
											{member.professionalName ?? "Profissional"}
										</p>
										<div className="flex items-center gap-1.5 shrink-0 ml-2">
											<span className="text-xs tabular-nums text-muted-foreground">
												{freeUsed}/{FREE_CONSULTS_PER_DOCTOR} grátis
											</span>
											{paidCount > 0 && (
												<Badge variant="outline" className="text-xs">
													+{paidCount} pagas
												</Badge>
											)}
										</div>
									</div>
									<p className="text-xs text-muted-foreground">
										{member.specialty}
									</p>
								</div>
							</div>
							<Progress
								value={(freeUsed / FREE_CONSULTS_PER_DOCTOR) * 100}
								className="h-1.5"
							/>
							{completed === 0 && (
								<p className="mt-1 text-xs text-muted-foreground">
									Nenhuma consulta realizada
								</p>
							)}
						</div>
					))}

					<Separator />

					<div className="rounded-lg bg-muted/50 p-3 text-xs space-y-1 text-muted-foreground">
						<p className="font-medium text-foreground">
							Resumo do modelo de pagamento
						</p>
						<p>
							• {members.length} profissional{members.length !== 1 ? "is" : ""}{" "}
							na clínica — limite gratuito: {FREE_DOCTORS}
						</p>
						<p>
							• {totalFreeQuota} consultas gratuitas totais (
							{FREE_CONSULTS_PER_DOCTOR} × {members.length})
						</p>
						<p>
							• {totalPaid} consulta{totalPaid !== 1 ? "s" : ""} além da cota
							gratuita
						</p>
						{extraDoctors > 0 && (
							<p>
								• {extraDoctors} profissional{extraDoctors !== 1 ? "is" : ""}{" "}
								extra — plano com +{extraDoctors * 20}% no valor base
							</p>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
