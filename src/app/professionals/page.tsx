"use client";

import { Suspense } from "react";

import ProfessionalsContent from "./_components/ProfessionalsContent";

export default function ProfissionaisPage() {
	return (
		<Suspense>
			<ProfessionalsContent />
		</Suspense>
	);
}
