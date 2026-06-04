"use client";

import { useApplicationStatus } from "@/hooks/api/doctors/use-application-status";
import { QueryBoundary } from "@/providers/query-boundary";
import { ConsultationPriceCard } from "./ConsultationPriceCard";
import { PaymentSettingsCard } from "./PaymentSettingsCard";
import { ServicesCard } from "./ServicesCard";

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
