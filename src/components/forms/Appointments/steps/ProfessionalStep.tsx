"use client";

import { useState } from "react";
import { DoctorFormField } from "./DoctorFormField";
import type { ProfessionalStepProps } from "./ProfessionalStep.types";
import { SelectedProfessionalCard } from "./SelectedProfessionalCard";

export function ProfessionalStep({
	control,
	professionals,
	professionalsLoading,
	professionalIdParam,
	selectedProfessional,
	initialSpecialtyFilter = "",
	onDoctorSelect,
	onDoctorClear,
}: ProfessionalStepProps) {
	const [specialtyFilter] = useState(initialSpecialtyFilter);

	const filteredProfessionals = specialtyFilter
		? professionals.filter((d) =>
				d.specialty?.toLowerCase().includes(specialtyFilter.toLowerCase()),
			)
		: professionals;

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2">
				<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
					1
				</div>
				<h3 className="font-semibold text-foreground">
					Escolha o profissional
				</h3>
			</div>

			<DoctorFormField
				control={control}
				professionals={filteredProfessionals}
				professionalsLoading={professionalsLoading}
				professionalIdParam={professionalIdParam}
				selectedProfessional={selectedProfessional}
				onDoctorSelect={onDoctorSelect}
			/>

			{selectedProfessional && (
				<SelectedProfessionalCard
					professional={selectedProfessional}
					showClear={!professionalIdParam}
					onClear={onDoctorClear}
				/>
			)}
		</div>
	);
}
