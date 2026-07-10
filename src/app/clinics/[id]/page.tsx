import { Suspense } from "react";

import { ClinicDetailContent } from "@/components/clinic/clinic-detail";

export const dynamic = "force-dynamic";

export default function ClinicDetailPage() {
	return (
		<Suspense>
			<ClinicDetailContent />
		</Suspense>
	);
}
