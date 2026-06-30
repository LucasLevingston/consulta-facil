"use client";

import { Stethoscope } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { AppointmentResponse } from "@/features/appointments";
import { useAppointmentFormSetup } from "@/hooks/use-appointment-form-setup";
import type { VoiceBookingResult } from "@/lib/types/ai";
import { ServiceSelector } from "./ServiceSelector";
import { DateTimeStep } from "./steps/DateTimeStep";
import { DetailsStep } from "./steps/DetailsStep";
import { ModalityStep } from "./steps/ModalityStep";
import { PaymentStep } from "./steps/PaymentStep";
import { ProfessionalStep } from "./steps/ProfessionalStep";

export const AppointmentForm = ({
	type = "create",
	appointment,
	setOpen,
	voicePreset,
}: {
	type: "create" | "schedule" | "cancel";
	appointment?: AppointmentResponse;
	setOpen?: Dispatch<SetStateAction<boolean>>;
	voicePreset?: VoiceBookingResult | null;
}) => {
	const {
		form,
		professionals,
		professionalsLoading,
		selectedProfessional,
		selectedDate,
		selectedServiceId,
		setSelectedServiceId,
		selectedTime,
		setSelectedTime,
		availableSlots,
		bookedTimesForDate,
		isQueueMode,
		scheduleLoading,
		isDayDisabled,
		handleTimeSelect,
		onSubmit,
		isPending,
		professionalIdParam,
	} = useAppointmentFormSetup({ type, appointment, setOpen, voicePreset });

	if (type === "cancel") {
		return (
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="cancellationReason"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-semibold text-primary">
									Motivo do cancelamento
								</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Descreva o motivo do cancelamento..."
										className="min-h-[120px] resize-none rounded-xl border-border"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{selectedProfessional && (
						<PaymentStep
							control={form.control}
							selectedProfessional={selectedProfessional}
						/>
					)}
					<Button
						type="submit"
						variant="destructive"
						className="w-full rounded-xl"
						disabled={isPending}
					>
						{isPending ? "Cancelando..." : "Cancelar Consulta"}
					</Button>
				</form>
			</Form>
		);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<ProfessionalStep
					control={form.control}
					professionals={professionals}
					professionalsLoading={professionalsLoading}
					professionalIdParam={professionalIdParam}
					selectedProfessional={selectedProfessional}
					initialSpecialtyFilter={voicePreset?.specialty ?? undefined}
					onDoctorSelect={() => {
						setSelectedTime("");
						setSelectedServiceId(null);
					}}
					onDoctorClear={() => {
						form.setValue("professionalId", "");
						setSelectedTime("");
					}}
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

				<DateTimeStep
					control={form.control}
					selectedProfessional={selectedProfessional}
					scheduleLoading={scheduleLoading}
					availableSlots={availableSlots}
					bookedTimesForDate={bookedTimesForDate}
					isQueueMode={isQueueMode}
					isDayDisabled={isDayDisabled}
					selectedDate={selectedDate}
					selectedTime={selectedTime}
					onTimeSelect={handleTimeSelect}
					onDateChange={() => setSelectedTime("")}
				/>

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
