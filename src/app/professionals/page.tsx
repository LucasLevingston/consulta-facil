"use client";

import { Suspense } from "react";

import ProfessionalsContent from "@/components/custom/ProfessionalsContent";

export default function ProfissionaisPage() {
	return (
		<Suspense>
			<ProfessionalsContent />
		</Suspense>
	);
}
