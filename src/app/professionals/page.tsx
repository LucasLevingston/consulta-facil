import { Suspense } from "react";

import ProfessionalsContent from "@/components/custom/professionals-content";

export const dynamic = "force-dynamic";

export default function ProfissionaisPage() {
	return (
		<Suspense>
			<ProfessionalsContent />
		</Suspense>
	);
}
