"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { setHours, setMinutes } from "date-fns";
import { Banknote, CreditCard, Info, Stethoscope } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { VoiceBookingResult } from "@/app/api/voice-booking/route";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { useCancelAppointment } from "@/hooks/api/appointments/use-cancel-appointment";
import { useProfessionalAppointments } from "@/hooks/api/appointments/use-professional-appointments";
import { useScheduleAppointment } from "@/hooks/api/appointments/use-schedule-appointment";
import { useProfessionals } from "@/hooks/api/doctors/use-professionals";
import { useProfessionalSchedule } from "@/hooks/api/schedule/use-professional-schedule";
import {
	type AppointmentFormValues,
	appointmentFormSchema,
} from "@/lib/schemas/appointment/appointment-form.schema";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";
import type { PaymentMethod } from "@/lib/schemas/doctor/payment-method.schema";
import { PAYMENT_METHOD_LABELS } from "@/lib/schemas/doctor/payment-method-labels";
import type { DayOfWeek } from "@/lib/schemas/schedule/days-of-week.schema";
import type { ProfessionalScheduleResponse } from "@/lib/schemas/schedule/professional-schedule-response.schema";
import { useUserStore } from "@/store/useUserStore";
import { JS_DAY_TO_DOW } from "@/utils/constants/day-to-dow";
import { ServiceSelector } from "./ServiceSelector";
import { DateTimeStep, type TimeSlot } from "./steps/DateTimeStep";
import { DetailsStep } from "./steps/DetailsStep";
import { ModalityStep } from "./steps/ModalityStep";
import { ProfessionalStep } from "./steps/ProfessionalStep";

function computeSlots(schedule: ProfessionalScheduleResponse): TimeSlot[] {
	const [startH, startM] = schedule.startTime.split(":").map(Number);
	const [endH, endM] = schedule.endTime.split(":").map(Number);
	const startMin = startH * 60 + startM;
	const endMin = endH * 60 + endM;
	const step =
		schedule.consultationDurationMinutes +
		schedule.breakBetweenConsultationsMinutes;
	const slots: TimeSlot[] = [];
	let current = startMin;
	while (current + schedule.consultationDurationMinutes <= endMin) {
		const h = Math.floor(current / 60);
		const m = current % 60;
		slots.push({
			label: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
			hours: h,
			minutes: m,
		});
		current += step;
	}
	return slots;
}

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
	const router = useRouter();
	const searchParams = useSearchParams();
	const professionalIdParam =
		searchParams.get("professionalid") ?? searchParams.get("doctorid");
	const serviceIdParam = searchParams.get("serviceid");
	const { user: authUser } = useUserStore();

	const { data: doctorsPage, isLoading: doctorsLoading } = useProfessionals(
		0,
		100,
	);
	const doctors = doctorsPage?.content ?? [];

	const scheduleAppointment = useScheduleAppointment();
	const cancelAppointment = useCancelAppointment();

	const [selectedTime, setSelectedTime] = useState<string>("");
	const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
		serviceIdParam,
	);

	const form = useForm<AppointmentFormValues>({
		resolver: zodResolver(appointmentFormSchema),
		defaultValues: {
			professionalId: appointment?.professionalId ?? professionalIdParam ?? "",
			scheduledAt: appointment ? new Date(appointment.scheduledAt) : undefined,
			reason: appointment?.reason ?? "",
			notes: appointment?.notes ?? "",
			cancellationReason: "",
			userId: authUser?.id ?? "",
			modality: appointment?.modality ?? "IN_PERSON",
		},
	});

	useEffect(() => {
		if (!voicePreset) return;
		if (voicePreset.reason) form.setValue("reason", voicePreset.reason);
		if (voicePreset.modality) form.setValue("modality", voicePreset.modality);
		if (voicePreset.date) {
			const d = new Date(`${voicePreset.date}T12:00:00`);
			if (!Number.isNaN(d.getTime())) form.setValue("scheduledAt", d);
		}
	}, [voicePreset, form]);

	const selectedProfessionalId = form.watch("professionalId");
	const selectedDate = form.watch("scheduledAt");
	const selectedDoctor = doctors.find(
		(d) =>
			d.id === selectedProfessionalId || d.userId === selectedProfessionalId,
	);

	const { data: scheduleList = [], isLoading: scheduleLoading } =
		useProfessionalSchedule(selectedDoctor?.id ?? "");

	const { data: professionalAppointmentsPage } = useProfessionalAppointments(
		selectedDoctor?.id ?? "",
		0,
		200,
	);

	const bookedTimesForDate = useMemo<Set<string>>(() => {
		if (!selectedDate || !professionalAppointmentsPage) return new Set();
		const dateStr = selectedDate.toDateString();
		return new Set(
			(professionalAppointmentsPage.content ?? [])
				.filter(
					(a) =>
						a.status !== "CANCELED" &&
						new Date(a.scheduledAt).toDateString() === dateStr,
				)
				.map((a) => {
					const d = new Date(a.scheduledAt);
					return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
				}),
		);
	}, [selectedDate, professionalAppointmentsPage]);

	const activeDaySet = useMemo<Set<DayOfWeek>>(
		() =>
			new Set(
				scheduleList
					.filter((s) => s.isActive)
					.map((s) => s.dayOfWeek as DayOfWeek),
			),
		[scheduleList],
	);

	const availableSlots = useMemo<TimeSlot[]>(() => {
		if (!selectedDate || scheduleList.length === 0) return [];
		const dow = JS_DAY_TO_DOW[selectedDate.getDay()];
		const daySchedule = scheduleList.find(
			(s) => s.dayOfWeek === dow && s.isActive,
		);
		if (!daySchedule) return [];
		return computeSlots(daySchedule);
	}, [selectedDate, scheduleList]);

	const isQueueMode =
		!!selectedDoctor && !scheduleLoading && scheduleList.length === 0;

	const isDayDisabled = (date: Date): boolean => {
		if (date < new Date(new Date().setHours(0, 0, 0, 0))) return true;
		if (scheduleList.length === 0) return false;
		const dow = JS_DAY_TO_DOW[date.getDay()];
		return !activeDaySet.has(dow);
	};

	const handleTimeSelect = (slot: TimeSlot) => {
		setSelectedTime(slot.label);
		const base = selectedDate ?? new Date();
		form.setValue(
			"scheduledAt",
			setMinutes(setHours(base, slot.hours), slot.minutes),
		);
	};

	const onSubmit = async (values: AppointmentFormValues) => {
		try {
			if (type === "create" || type === "schedule") {
				const created = await scheduleAppointment.mutateAsync({
					professionalId: selectedDoctor?.id ?? values.professionalId,
					scheduledAt: (values.scheduledAt as Date).toISOString(),
					reason: values.reason ?? undefined,
					notes: values.notes ?? undefined,
					modality: values.modality,
					chosenPaymentMethod: values.chosenPaymentMethod,
					serviceId: selectedServiceId ?? undefined,
				});
				if (created.checkoutUrl) {
					window.location.href = created.checkoutUrl;
					return;
				}
				if (type === "create") {
					form.reset();
					router.push(`/dashboard/appointments/${created.id}`);
				} else {
					setOpen?.(false);
					form.reset();
				}
			} else if (type === "cancel") {
				if (!appointment) return;
				await cancelAppointment.mutateAsync({
					id: appointment.id,
					data: { cancellationReason: values.cancellationReason ?? "" },
				});
				setOpen?.(false);
				form.reset();
			}
		} catch (error: unknown) {
			toast.error(
				(error instanceof Error ? error.message : null) ??
					"Erro ao processar consulta.",
			);
		}
	};

	const isPending =
		scheduleAppointment.isPending || cancelAppointment.isPending;

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

					{selectedDoctor &&
						(selectedDoctor.acceptedPaymentMethods?.length ?? 0) > 0 && (
							<div className="space-y-3">
								{selectedDoctor.paymentTiming === "AT_CONSULTATION" && (
									<Alert className="rounded-xl border-blue-500/20 bg-blue-500/5">
										<Info className="h-4 w-4 text-blue-500" />
										<AlertDescription className="text-xs text-blue-700 dark:text-blue-400">
											O pagamento é realizado presencialmente no dia da
											consulta.
										</AlertDescription>
									</Alert>
								)}
								{selectedDoctor.paymentTiming === "AT_SCHEDULING" && (
									<Alert className="rounded-xl border-amber-500/20 bg-amber-500/5">
										<CreditCard className="h-4 w-4 text-amber-500" />
										<AlertDescription className="text-xs text-amber-700 dark:text-amber-400">
											Este profissional exige pagamento no momento do
											agendamento.
										</AlertDescription>
									</Alert>
								)}
								<FormField
									control={form.control}
									name="chosenPaymentMethod"
									render={({ field }) => (
										<FormItem>
											<div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
												{(selectedDoctor.acceptedPaymentMethods ?? []).map(
													(method) => (
														<button
															key={method}
															type="button"
															onClick={() =>
																field.onChange(
																	field.value === method ? undefined : method,
																)
															}
															className={`flex items-center gap-2 rounded-xl border p-3 text-left text-sm transition-colors ${
																field.value === method
																	? "border-primary bg-primary/5 text-primary"
																	: "border-border hover:border-primary/40"
															}`}
														>
															{method === "MERCADOPAGO" ? (
																<CreditCard className="h-4 w-4 shrink-0" />
															) : (
																<Banknote className="h-4 w-4 shrink-0" />
															)}
															<span className="font-medium">
																{PAYMENT_METHOD_LABELS[method as PaymentMethod]}
															</span>
														</button>
													),
												)}
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
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
					doctors={doctors}
					doctorsLoading={doctorsLoading}
					professionalIdParam={professionalIdParam}
					selectedDoctor={selectedDoctor}
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

				{selectedDoctor && (
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
							professionalId={selectedDoctor.id}
							consultationPrice={selectedDoctor.consultationPrice}
							value={selectedServiceId}
							onChange={setSelectedServiceId}
						/>
					</div>
				)}

				<DateTimeStep
					control={form.control}
					selectedDoctor={selectedDoctor}
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
