"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import DoctorCard from "@/components/custom/doctor/doctorCard";
import { Form } from "@/components/ui/form";
import {
  useCancelAppointment,
  useScheduleAppointment,
} from "@/hooks/api/use-appointments";
import { useDoctors } from "@/hooks/api/use-doctors";
import { toast } from "@/hooks/use-toast";
import type { AppointmentResponse } from "@/lib/schemas/appointment.schema";

import "react-datepicker/dist/react-datepicker.css";

import { useUserStore } from "@/store/useUserStore";
import CustomFormField, {
  FormFieldType,
} from "../../forms-components/custom-form-field";
import { CustomSubmitButton } from "../../forms-components/custom-submit-button";
import { CreateAppointmentSchema } from "./CreateAppointmentSchema";

export const AppointmentForm = ({
	type = "create",
	appointment,
	setOpen,
}: {
	type: "create" | "schedule" | "cancel";
	appointment?: AppointmentResponse;
	setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const doctorIdParam = searchParams.get("doctorid");
	const { user: authUser } = useUserStore();

	const { data: doctorsPage, isLoading: doctorsLoading } = useDoctors(0, 50);
	const doctors = doctorsPage?.content ?? [];

	const scheduleAppointment = useScheduleAppointment();
	const cancelAppointment = useCancelAppointment();

	const form = useForm<z.infer<typeof CreateAppointmentSchema>>({
		resolver: zodResolver(CreateAppointmentSchema),
		defaultValues: {
			doctorId: appointment?.doctorId ?? doctorIdParam ?? "",
			scheduledAt: appointment ? new Date(appointment.scheduledAt) : new Date(),
			reason: appointment?.reason ?? "",
			notes: appointment?.notes ?? "",
			cancellationReason: "",
			userId: authUser?.id ?? "",
		},
	});

	const selectedDoctorId = form.watch("doctorId");
	const preselectedDoctor = doctors.find((d) => d.userId === selectedDoctorId);

	const onSubmit = async (values: z.infer<typeof CreateAppointmentSchema>) => {
		try {
			if (type === "create" || type === "schedule") {
				await scheduleAppointment.mutateAsync({
					doctorId: values.doctorId,
					scheduledAt: (values.scheduledAt as Date).toISOString(),
					reason: values.reason ?? undefined,
					notes: values.notes ?? undefined,
				});
				if (type === "create") {
					form.reset();
					router.push("/agendar-consulta/success");
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
			toast({
				title:
					(error instanceof Error ? error.message : null) ??
					"Erro ao processar consulta.",
				variant: "destructive",
			});
		}
	};

	const isLoading =
		scheduleAppointment.isPending ||
		cancelAppointment.isPending ||
		doctorsLoading;

	const buttonLabel =
		type === "cancel"
			? "Cancelar Consulta"
			: type === "schedule"
				? "Agendar Consulta"
				: "Enviar Consulta";

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
				{type === "create" && (
					<section className="mb-12 space-y-4">
						<h1 className="header">Nova Consulta</h1>
						<p className="opacity-80">
							Solicite uma nova consulta em 10 segundos.
						</p>
					</section>
				)}

				{type !== "cancel" && (
					<>
						{preselectedDoctor && doctorIdParam ? (
							<DoctorCard
								doctor={preselectedDoctor}
								isActiveAppointmentButton={false}
							/>
						) : (
							<CustomFormField
								fieldType={FormFieldType.SELECT}
								name="doctorId"
								form={form}
							>
								{doctors.map((doctor) =>
									doctor.name ? (
										<option key={doctor.id} value={doctor.userId}>
											Dr. {doctor.name} — {doctor.specialty}
										</option>
									) : null,
								)}
							</CustomFormField>
						)}

						<CustomFormField
							fieldType={FormFieldType.DATE_PICKER}
							name="scheduledAt"
							form={form}
						/>

						<div
							className={`flex flex-col gap-6 ${type === "create" && "xl:flex-row"}`}
						>
							<CustomFormField
								fieldType={FormFieldType.TEXTAREA}
								name="reason"
								form={form}
								disabled={type === "schedule"}
							/>
							<CustomFormField
								fieldType={FormFieldType.TEXTAREA}
								name="notes"
								form={form}
								disabled={type === "schedule"}
							/>
						</div>
					</>
				)}

				{type === "cancel" && (
					<CustomFormField
						fieldType={FormFieldType.TEXTAREA}
						name="cancellationReason"
						form={form}
					/>
				)}

				<CustomSubmitButton form={form}>{buttonLabel}</CustomSubmitButton>
			</form>
		</Form>
	);
};
