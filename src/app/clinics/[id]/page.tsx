import { Suspense } from "react";

import { ClinicDetailContent } from "@/components/clinic/ClinicDetailContent";

export const dynamic = "force-dynamic";

export default function ClinicDetailPage() {
	return (
		<Suspense>
			<ClinicDetailContent />
		</Suspense>
	);
}
