"use client";

import { Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import DoctorFilters from "@/components/custom/doctor/DoctorFilters";
import DoctorsList from "@/components/custom/doctor/DoctorsClientList";
import PageHeader from "@/components/custom/page-header";
import { useDoctors, useSearchDoctors } from "@/hooks/api/use-doctors";
import { QueryBoundary } from "@/providers/query-boundary";

export default function ProfissionaisPage() {
	const searchParams = useSearchParams();
	const specialty = searchParams.get("specialty") || "";
	const name = searchParams.get("name") || "";

	const allQuery = useDoctors(0, 100);
	const specialtyQuery = useSearchDoctors(specialty);

	const isLoading = specialty ? specialtyQuery.isLoading : allQuery.isLoading;
	const error = specialty ? specialtyQuery.error : allQuery.error;

	const rawDoctors = specialty
		? (specialtyQuery.data?.content ?? [])
		: (allQuery.data?.content ?? []);

	const doctors = name
		? rawDoctors.filter((d) =>
				d.name?.toLowerCase().includes(name.toLowerCase()),
			)
		: rawDoctors;

	return (
		<div className="space-y-6">
			<PageHeader
				title="Profissionais"
				description="Encontre especialistas cadastrados na plataforma."
				icon={<Users className="h-6 w-6" />}
				count={doctors.length}
				countLabel="profissional"
			/>

			<QueryBoundary isLoading={isLoading} error={error}>
				<div className="space-y-4">
					<DoctorFilters />
					<DoctorsList doctors={doctors} />
				</div>
			</QueryBoundary>
		</div>
	);
}
