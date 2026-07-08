export const dynamic = "force-dynamic";

import { CreditCard } from "lucide-react";

import PageHeader from "@/components/custom/page-header";
import Plans from "@/components/custom/plans/Plans";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";

export default function BillingPage() {
	return (
		<div className="space-y-6">
			<PageHeader
				title="Assinatura"
				description="Gerencie seu plano e acesso à plataforma."
				icon={<CreditCard className="h-6 w-6" />}
			/>
			<SuspenseBoundary>
				<Plans />
			</SuspenseBoundary>
		</div>
	);
}
