"use client";

import { useApplicationStatus } from "@/components/professionals/hooks";
import { ConsultationPriceCard } from "@/components/services/consultation-price-card";
import { PaymentSettingsCard } from "@/components/services/payment-settings-card";
import { ServicesCard } from "@/components/services/services-card";
import { QueryBoundary } from "@/providers/query-boundary";

export function ServicesContent() {
	const { data: profile, isLoading, error } = useApplicationStatus();
	const professionalId = profile?.id ?? "";

	return (
		<QueryBoundary isLoading={isLoading} error={error}>
			<div className="space-y-6 max-w-3xl">
				<ConsultationPriceCard
					consultationPrice={profile?.consultationPrice ?? null}
				/>
				<PaymentSettingsCard
					acceptedPaymentMethods={profile?.acceptedPaymentMethods ?? []}
					paymentTiming={profile?.paymentTiming ?? null}
				/>
				<ServicesCard professionalId={professionalId} />
			</div>
		</QueryBoundary>
	);
}
