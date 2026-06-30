"use client";

import type { DoctorsListProps } from "./DoctorsClientList.types";
import DoctorCard from "./doctorCard";

export default function DoctorsList({ doctors }: DoctorsListProps) {
	if (doctors.length === 0) {
		return (
			<p className="text-center text-muted-foreground py-12">
				Nenhum profissional encontrado com os filtros selecionados.
			</p>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{doctors.map((doctor) => (
				<DoctorCard doctor={doctor} key={doctor.id} />
			))}
		</div>
	);
}
