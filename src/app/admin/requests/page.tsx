"use client";

import { Stethoscope } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PendingApplicationCard } from "@/components/admin/PendingApplicationCard";
import PageHeader from "@/components/custom/page-header";
import { Badge } from "@/components/ui/badge";
import { usePendingApplications } from "@/hooks/api/professionals/use-pending-applications";
import { usePermission } from "@/hooks/use-permission";
import { QueryBoundary } from "@/providers/query-boundary";

export default function AdminRequestsPage() {
	const { can } = usePermission();
	const router = useRouter();

	useEffect(() => {
		if (!can("admin:access")) router.push("/dashboard");
	}, [can, router]);

	const { data, isLoading, error } = usePendingApplications(0, 100);
	const applications = data?.content ?? [];

	return (
		<div className="space-y-6">
			<PageHeader
				title="Solicitações"
				description="Solicitações pendentes de cadastro como profissional."
				icon={<Stethoscope className="h-6 w-6" />}
				count={applications.length}
				countLabel="solicitação"
			/>

			<QueryBoundary isLoading={isLoading} error={error}>
				{applications.length === 0 ? (
					<div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-border">
						<p className="text-sm text-muted-foreground">
							Nenhuma solicitação pendente.
						</p>
					</div>
				) : (
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<h2 className="text-sm font-medium text-muted-foreground">
								Aguardando aprovação
							</h2>
							<Badge variant="destructive" className="text-xs">
								{applications.length}
							</Badge>
						</div>
						{applications.map((doctor) => (
							<PendingApplicationCard key={doctor.id} doctor={doctor} />
						))}
					</div>
				)}
			</QueryBoundary>
		</div>
	);
}
