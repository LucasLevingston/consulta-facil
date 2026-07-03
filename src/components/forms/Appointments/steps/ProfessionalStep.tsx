"use client";

import { useState } from "react";
import { ProfessionalFormField } from "./ProfessionalFormField";
import type { ProfessionalStepProps } from "./ProfessionalStep.types";
import { SelectedProfessionalCard } from "./SelectedProfessionalCard";

export function ProfessionalStep({
	hook,
	initialSpecialtyFilter = "",
}: ProfessionalStepProps) {
	const {
		form,
		professionals,
		professionalsLoading,
		professionalIdParam,
		selectedProfessional,
		setSelectedTime,
		setSelectedServiceId,
	} = hook;

	const [specialtyFilter] = useState(initialSpecialtyFilter);

	const filteredProfessionals = specialtyFilter
		? professionals.filter((d) =>
				d.specialty?.toLowerCase().includes(specialtyFilter.toLowerCase()),
			)
		: professionals;

	function onProfessionalSelect() {
		setSelectedTime("");
		setSelectedServiceId(null);
	}

	function onProfessionalClear() {
		form.setValue("professionalId", "");
		setSelectedTime("");
	}

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

			<ProfessionalFormField
				control={form.control}
				professionals={filteredProfessionals}
				professionalsLoading={professionalsLoading}
				professionalIdParam={professionalIdParam}
				selectedProfessional={selectedProfessional}
				onProfessionalSelect={onProfessionalSelect}
			/>

			{selectedProfessional && (
				<SelectedProfessionalCard
					professional={selectedProfessional}
					showClear={!professionalIdParam}
					onClear={onProfessionalClear}
				/>
			)}
		</div>
	);
}
