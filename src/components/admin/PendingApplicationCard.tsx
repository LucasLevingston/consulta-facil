"use client";

import { Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	useApproveApplication,
	useRejectApplication,
} from "@/features/professionals";
import { SPECIALTY_LABELS } from "@/utils/constants/profession-specialties";
import type { PendingApplicationCardProps } from "./PendingApplicationCard.types";

export function PendingApplicationCard({
	doctor,
}: PendingApplicationCardProps) {
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
					{SPECIALTY_LABELS[doctor.specialty] ?? doctor.specialty}
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
