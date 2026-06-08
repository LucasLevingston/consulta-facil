import { Suspense } from "react";

import { ClinicDetailContent } from "@/components/clinic/ClinicDetailContent";

export default function ClinicDetailPage() {
	return (
		<Suspense>
			<ClinicDetailContent />
		</Suspense>
	);
}
