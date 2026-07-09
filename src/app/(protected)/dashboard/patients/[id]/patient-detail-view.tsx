"use client";

import { useParams } from "next/navigation";
import { Suspense } from "react";

import { PatientDetailContent } from "@/components/patients/detail/PatientDetailContent";

export function PatientDetailView() {
	const { id } = useParams<{ id: string }>();
	return (
		<Suspense>
			<PatientDetailContent id={id} />
		</Suspense>
	);
}
