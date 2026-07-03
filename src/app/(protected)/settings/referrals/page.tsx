"use client";

import { Users } from "lucide-react";
import PageHeader from "@/components/custom/page-header";
import { ReferralCodeCard } from "@/components/referral/ReferralCodeCard";
import { ReferralStatsCard } from "@/components/referral/ReferralStatsCard";
import { Button } from "@/components/ui/button";
import { useMyReferralStats, useRegenerateCode } from "@/features/billing";

export default function ReferralsSettingsPage() {
	const { data: stats, isLoading } = useMyReferralStats();
	const regenerate = useRegenerateCode();

	return (
		<div className="space-y-6">
			<PageHeader
				title="Programa de Indicacao"
				description="Indique amigos e ganhe comissoes por cada pagamento."
				icon={<Users className="h-6 w-6" />}
			/>

			{isLoading ? (
				<ReferralCodeCard code="" isLoading />
			) : stats ? (
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
			) : null}
		</div>
	);
}
