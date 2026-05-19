"use client";

import { Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import PageHeader from "@/components/custom/page-header";
import DoctorFilters from "@/components/custom/doctor/DoctorFilters";
import DoctorsList from "@/components/custom/doctor/DoctorsClientList";
import { useDoctors } from "@/hooks/api/use-doctors";
import { QueryBoundary } from "@/providers/query-boundary";

export default function ProfessionalsContent() {
	const searchParams = useSearchParams();
	const name = searchParams.get("name") ?? "";
	const specialty = searchParams.get("specialty") ?? "";
	const minRating = Number(searchParams.get("minRating") ?? "0");
	const minConsultations = Number(searchParams.get("minConsultations") ?? "0");

	const { data, isLoading, error } = useDoctors(0, 200);

	const filtered = useMemo(() => {
		const all = data?.content ?? [];
		return all.filter((d) => {
			if (name && !d.name?.toLowerCase().includes(name.toLowerCase())) return false;
			if (specialty && d.specialty !== specialty) return false;
			if (minRating > 0 && (d.rating ?? 0) < minRating) return false;
			if (minConsultations > 0 && (d.consultationCount ?? 0) < minConsultations) return false;
			return true;
		});
	}, [data, name, specialty, minRating, minConsultations]);

	return (
		<QueryBoundary isLoading={isLoading} error={error}>
			<PageHeader
				title="Profissionais"
				description="Encontre especialistas cadastrados na plataforma."
				icon={<Users className="h-6 w-6" />}
				count={filtered.length}
				countLabel="profissional"
			/>

			<div className="space-y-4">
				<DoctorFilters />
				<DoctorsList doctors={filtered} />
			</div>
		</QueryBoundary>
	);
}
