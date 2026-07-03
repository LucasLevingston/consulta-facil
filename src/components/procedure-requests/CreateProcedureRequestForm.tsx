"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useProfessionalPatients } from "@/features/patients";
import {
	type CreateProcedureRequestInput,
	createProcedureRequestSchema,
	useCreateProcedureRequest,
} from "@/features/procedure-requests";
import { useGetProfessionalServices } from "@/features/services";
import type { CreateProcedureRequestFormProps } from "./CreateProcedureRequestForm.types";
import { CreateProcedureRequestFormFields } from "./CreateProcedureRequestFormFields";

export function CreateProcedureRequestForm({
	professionalId,
	onClose,
}: CreateProcedureRequestFormProps) {
	const { data: services = [] } = useGetProfessionalServices(professionalId);
	const { data: patientsPage } = useProfessionalPatients(professionalId, {
		size: 100,
	});
	const patients = patientsPage?.content ?? [];
	const requiresConsultationServices = services.filter(
		(s) => s.requiresConsultation,
	);

	const { mutateAsync: create, isPending } = useCreateProcedureRequest();

	const form = useForm<CreateProcedureRequestInput>({
		resolver: zodResolver(createProcedureRequestSchema),
		defaultValues: { serviceId: "", patientId: "", notes: "" },
	});

	async function onSubmit(values: CreateProcedureRequestInput) {
		try {
			await create(values);
			toast.success("Solicitação criada!");
			onClose();
		} catch {
			toast.error("Erro ao criar solicitação.");
		}
	}

	return (
		<CreateProcedureRequestFormFields
			form={form}
			services={requiresConsultationServices}
			patients={patients}
			isPending={isPending}
			onClose={onClose}
			onSubmit={form.handleSubmit(onSubmit)}
		/>
	);
}
