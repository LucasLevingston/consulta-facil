"use client";

import { useParams } from "next/navigation";
import { Suspense } from "react";

import { PatientDetailContent } from "@/components/patients/detail/PatientDetailContent";

export default function PatientDetailPage() {
	const { id } = useParams<{ id: string }>();
	return (
		<Suspense>
			<PatientDetailContent id={id} />
		</Suspense>
	);
}
