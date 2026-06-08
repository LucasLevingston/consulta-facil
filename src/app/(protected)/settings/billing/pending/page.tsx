import { Clock } from "lucide-react";

import { PaymentResult } from "@/components/billing/PaymentResult";

export default function BillingPendingPage() {
	return (
		<PaymentResult
			icon={
				<div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500/10">
					<Clock className="h-10 w-10 text-yellow-500" />
				</div>
			}
			title="Pagamento em processamento"
			description="Seu pagamento está sendo processado. Você receberá uma confirmação em breve."
			buttonLabel="Voltar ao dashboard"
			buttonHref="/dashboard"
			buttonVariant="outline"
		/>
	);
}
