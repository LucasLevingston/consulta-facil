"use client";

import { Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { AppointmentCancelStep } from "./AppointmentCancelStep";
import type { AppointmentFormProps } from "./AppointmentForm.types";
import { ServiceSelector } from "./ServiceSelector";
import { DateTimeStep } from "./steps/DateTimeStep";
import { DetailsStep } from "./steps/DetailsStep";
import { ModalityStep } from "./steps/ModalityStep";
import { ProfessionalStep } from "./steps/ProfessionalStep";
import { useAppointmentFormSetup } from "./use-appointment-form-setup";

export const AppointmentForm = ({
	type = "create",
	appointment,
	setOpen,
	voicePreset,
}: AppointmentFormProps) => {
	const hook = useAppointmentFormSetup({
		type,
		appointment,
		setOpen,
		voicePreset,
	});
	const {
		form,
		selectedProfessional,
		selectedServiceId,
		setSelectedServiceId,
		isQueueMode,
		selectedDate,
		selectedTime,
		onSubmit,
		isPending,
	} = hook;

	if (type === "cancel") {
		return <AppointmentCancelStep hook={hook} />;
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<ProfessionalStep
					hook={hook}
					initialSpecialtyFilter={voicePreset?.specialty ?? undefined}
				/>

				{selectedProfessional && (
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
								2
							</div>
							<h3 className="font-semibold text-foreground">
								O que você quer agendar?
							</h3>
						</div>
						<ServiceSelector
							professionalId={selectedProfessional.id}
							consultationPrice={selectedProfessional.consultationPrice}
							value={selectedServiceId}
							onChange={setSelectedServiceId}
						/>
					</div>
				)}

				<DateTimeStep hook={hook} />

				<ModalityStep control={form.control} />

				<DetailsStep control={form.control} />

				<Button
					type="submit"
					className="w-full h-12 rounded-xl text-base font-semibold gap-2"
					disabled={
						isPending || (!isQueueMode && !!selectedDate && !selectedTime)
					}
				>
					<Stethoscope className="h-5 w-5" />
					{isPending
						? "Agendando..."
						: type === "schedule"
							? "Agendar Consulta"
							: "Confirmar Agendamento"}
				</Button>
			</form>
		</Form>
	);
};
