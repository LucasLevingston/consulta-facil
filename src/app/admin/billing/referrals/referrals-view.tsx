"use client";

import { Users } from "lucide-react";
import PageHeader from "@/components/custom/page-header";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { ReferralStatus } from "@/features/billing";
import { useAdminReferrals } from "./use-admin-referrals";

const STATUS_LABELS: Record<ReferralStatus, string> = {
	PENDING: "Pendente",
	APPROVED: "Aprovado",
	REJECTED: "Rejeitado",
	EXPIRED: "Expirado",
};

const STATUS_VARIANT: Record<
	ReferralStatus,
	"secondary" | "default" | "destructive"
> = {
	PENDING: "secondary",
	APPROVED: "default",
	REJECTED: "destructive",
	EXPIRED: "destructive",
};

function AdminReferralsContent() {
	const { data: referrals } = useAdminReferrals();

	return (
		<div className="space-y-6 p-6">
			<PageHeader
				title="Indicacoes"
				description="Programa de indicacao dos usuarios."
				count={referrals.length}
				countLabel="indicacao"
				icon={<Users className="h-6 w-6" />}
			/>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Indicador</TableHead>
						<TableHead>Indicado</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Data</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{referrals.map((r) => (
						<TableRow key={r.id}>
							<TableCell className="font-mono text-xs">
								{r.referrerId.slice(0, 8)}...
							</TableCell>
							<TableCell className="font-mono text-xs">
								{r.referredId.slice(0, 8)}...
							</TableCell>
							<TableCell>
								<Badge variant={STATUS_VARIANT[r.status]}>
									{STATUS_LABELS[r.status]}
								</Badge>
							</TableCell>
							<TableCell>
								{new Date(r.createdAt).toLocaleDateString("pt-BR")}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

export function AdminReferralsView() {
	return (
		<SuspenseBoundary>
			<AdminReferralsContent />
		</SuspenseBoundary>
	);
}
