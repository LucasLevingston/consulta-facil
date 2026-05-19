"use client";

import { Users } from "lucide-react";
import { Suspense } from "react";

import DoctorFilters from "@/components/custom/doctor/DoctorFilters";
import DoctorsList from "@/components/custom/doctor/DoctorsClientList";
import PageHeader from "@/components/custom/page-header";
import { useDoctors } from "@/hooks/api/use-doctors";
import { QueryBoundary } from "@/providers/query-boundary";

export default function ProfissionaisPage() {
	const { data: doctors, isLoading, error } = useDoctors();

	return (
		<QueryBoundary isLoading={isLoading} error={error}>
			<PageHeader
				title="Profissionais"
				description="Encontre especialistas cadastrados na plataforma."
				icon={<Users className="h-6 w-6" />}
				count={doctors?.totalElements}
				countLabel="profissional"
			/>

			<div className="space-y-4">
				<Suspense>
					<DoctorFilters />
				</Suspense>
				<DoctorsList doctors={doctors?.content ?? []} />
			</div>
		</QueryBoundary>
	);
}
