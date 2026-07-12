"use client";

import { Users } from "lucide-react";
import PageHeader from "@/components/custom/page-header";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import { ReferralCodeCard } from "@/components/referral/ReferralCodeCard";
import { ReferralStatsCard } from "@/components/referral/ReferralStatsCard";
import { Button } from "@/components/ui/button";
import { useMyReferralStats } from "./use-my-referral-stats";
import { useRegenerateCode } from "./use-regenerate-code";

function ReferralsSettingsContent() {
	const { data: stats } = useMyReferralStats();
	const regenerate = useRegenerateCode();

	return stats ? (
		<>
			<ReferralCodeCard code={stats.code} />
			<ReferralStatsCard stats={stats} />
			<Button
				variant="outline"
				onClick={() => regenerate.mutate()}
				disabled={regenerate.isPending}
			>
				{regenerate.isPending ? "Gerando..." : "Gerar novo codigo"}
			</Button>
		</>
	) : null;
}

export function ReferralsSettingsView() {
	return (
		<div className="space-y-6">
			<PageHeader
				title="Programa de Indicacao"
				description="Indique amigos e ganhe comissoes por cada pagamento."
				icon={<Users className="h-6 w-6" />}
			/>

			<SuspenseBoundary>
				<ReferralsSettingsContent />
			</SuspenseBoundary>
		</div>
	);
}
