"use client";

import { Check, Loader2, Stethoscope, X } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApproveApplication } from "@/hooks/api/doctors/use-approve-application";
import { usePendingApplications } from "@/hooks/api/doctors/use-pending-applications";
import { useRejectApplication } from "@/hooks/api/doctors/use-reject-application";
import type { DoctorResponse } from "@/lib/schemas/doctor/professional-response.schema";
import { QueryBoundary } from "@/providers/query-boundary";

function PendingApplicationCard({ doctor }: { doctor: DoctorResponse }) {
	const { mutateAsync: approve, isPending: isApproving } =
		useApproveApplication();
	const { mutateAsync: reject, isPending: isRejecting } =
		useRejectApplication();
	const isLoading = isApproving || isRejecting;

	async function handleApprove() {
		try {
			await approve(doctor.id);
			toast.success(`${doctor.name ?? "Profissional"} aprovado com sucesso`);
		} catch {
			toast.error("Erro ao aprovar solicitação");
		}
	}

	async function handleReject() {
		try {
			await reject(doctor.id);
			toast.success("Solicitação recusada");
		} catch {
			toast.error("Erro ao recusar solicitação");
		}
	}

	return (
		<div className="flex items-center gap-4 rounded-xl border border-border p-4">
			<Avatar className="h-10 w-10 shrink-0">
				<AvatarImage
					src={doctor.imageUrl ?? undefined}
					alt={doctor.name ?? ""}
				/>
				<AvatarFallback>{(doctor.name ?? "?")[0]}</AvatarFallback>
			</Avatar>
			<div className="min-w-0 flex-1">
				<p className="truncate font-medium text-sm">{doctor.name}</p>
				<p className="truncate text-xs text-muted-foreground">{doctor.email}</p>
				<Badge variant="secondary" className="mt-1 text-xs">
					{doctor.specialty}
				</Badge>
			</div>
			<div className="flex shrink-0 gap-2">
				<Button
					size="sm"
					variant="outline"
					className="h-8 gap-1 border-destructive/40 text-destructive hover:bg-destructive/10"
					onClick={handleReject}
					disabled={isLoading}
				>
					{isRejecting ? (
						<Loader2 className="h-3 w-3 animate-spin" />
					) : (
						<X className="h-3 w-3" />
					)}
					Recusar
				</Button>
				<Button
					size="sm"
					className="h-8 gap-1"
					onClick={handleApprove}
					disabled={isLoading}
				>
					{isApproving ? (
						<Loader2 className="h-3 w-3 animate-spin" />
					) : (
						<Check className="h-3 w-3" />
					)}
					Aprovar
				</Button>
			</div>
		</div>
	);
}

export function PendingApplications() {
	const { data, isLoading, error } = usePendingApplications(0, 50);
	const applications = data?.content ?? [];

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-base">
					<Stethoscope className="h-4 w-4 text-primary" />
					Solicitações pendentes
					{applications.length > 0 && (
						<Badge variant="destructive" className="ml-1 text-xs">
							{applications.length}
						</Badge>
					)}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<QueryBoundary isLoading={isLoading} error={error}>
					{applications.length === 0 ? (
						<p className="text-sm text-muted-foreground py-4 text-center">
							Nenhuma solicitação pendente
						</p>
					) : (
						<div className="space-y-3">
							{applications.map((doctor) => (
								<PendingApplicationCard key={doctor.id} doctor={doctor} />
							))}
						</div>
					)}
				</QueryBoundary>
			</CardContent>
		</Card>
	);
}
