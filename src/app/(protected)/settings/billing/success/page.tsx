import { Suspense } from "react";

import { BillingSuccessContent } from "@/components/billing/BillingSuccessContent";

export default function BillingSuccessPage() {
	return (
		<Suspense>
			<BillingSuccessContent />
		</Suspense>
	);
}
