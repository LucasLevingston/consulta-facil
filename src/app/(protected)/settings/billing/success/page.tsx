"use client";

import { CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { PaymentResult } from "@/components/billing/PaymentResult";

const planLabel: Record<string, string> = {
	monthly: "Pro Mensal",
	yearly: "Pro Anual",
};

function BillingSuccessContent() {
	const params = useSearchParams();
	const planId = params.get("planId") ?? "";

	return (
		<PaymentResult
			icon={
				<div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
					<CheckCircle2 className="h-10 w-10 text-green-500" />
				</div>
			}
			title="Pagamento confirmado!"
			description={
				<>
					Seu plano{" "}
					<span className="font-semibold text-foreground">
						{planLabel[planId] ?? "Pro"}
					</span>{" "}
					foi ativado com sucesso.
				</>
			}
			buttonLabel="Ir para o dashboard"
			buttonHref="/dashboard"
		/>
	);
}

export default function BillingSuccessPage() {
	return (
		<Suspense>
			<BillingSuccessContent />
		</Suspense>
	);
}
