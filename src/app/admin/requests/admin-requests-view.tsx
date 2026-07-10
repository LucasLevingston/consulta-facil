"use client";

import { Stethoscope } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PendingApplicationCard } from "@/components/admin/PendingApplicationCard";
import PageHeader from "@/components/custom/page-header";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import { usePendingApplications } from "@/components/professionals/hooks";
import { Badge } from "@/components/ui/badge";
import { usePermission } from "@/features/auth";

function PendingApplicationsList() {
	const { data } = usePendingApplications(0, 100);
	const applications = data.content;

	return (
		<>
			<PageHeader
				title="Solicitações"
				description="Solicitações pendentes de cadastro como profissional."
				icon={<Stethoscope className="h-6 w-6" />}
				count={applications.length}
				countLabel="solicitação"
			/>

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
					{applications.map((professional) => (
						<PendingApplicationCard
							key={professional.id}
							professional={professional}
						/>
					))}
				</div>
			)}
		</>
	);
}

export function AdminRequestsView() {
	const { can } = usePermission();
	const router = useRouter();

	useEffect(() => {
		if (!can("admin:access")) router.push("/dashboard");
	}, [can, router]);

	return (
		<SuspenseBoundary>
			<PendingApplicationsList />
		</SuspenseBoundary>
	);
}
