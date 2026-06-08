import { XCircle } from "lucide-react";

import { PaymentResult } from "@/components/billing/PaymentResult";

export default function BillingFailurePage() {
	return (
		<PaymentResult
			icon={
				<div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
					<XCircle className="h-10 w-10 text-destructive" />
				</div>
			}
			title="Pagamento não concluído"
			description="Houve um problema com o seu pagamento. Nenhuma cobrança foi realizada."
			buttonLabel="Tentar novamente"
			buttonHref="/settings/billing"
			buttonVariant="outline"
		/>
	);
}
