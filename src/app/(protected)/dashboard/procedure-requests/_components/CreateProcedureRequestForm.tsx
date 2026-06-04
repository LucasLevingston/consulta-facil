"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProfessionalPatients } from "@/hooks/api/patients/use-professional-patients";
import { useCreateProcedureRequest } from "@/hooks/api/procedure-requests/use-create-procedure-request";
import { useGetProfessionalServices } from "@/hooks/api/services/use-get-professional-services";
import {
	type CreateProcedureRequestInput,
	createProcedureRequestSchema,
} from "@/lib/schemas/procedure-request.schema";

export function CreateProcedureRequestForm({
	professionalId,
	onClose,
}: {
	professionalId: string;
	onClose: () => void;
}) {
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
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
			<div className="space-y-1">
				<Label>Serviço *</Label>
				<Select
					onValueChange={(v) => form.setValue("serviceId", v)}
					value={form.watch("serviceId")}
				>
					<SelectTrigger>
						<SelectValue placeholder="Selecione um serviço" />
					</SelectTrigger>
					<SelectContent>
						{requiresConsultationServices.length === 0 && (
							<SelectItem value="_none" disabled>
								Nenhum serviço requer consulta prévia
							</SelectItem>
						)}
						{requiresConsultationServices.map((s) => (
							<SelectItem key={s.id} value={s.id}>
								{s.name} — R$ {s.price.toFixed(2)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{form.formState.errors.serviceId && (
					<p className="text-xs text-destructive">
						{form.formState.errors.serviceId.message}
					</p>
				)}
			</div>

			<div className="space-y-1">
				<Label>Paciente *</Label>
				{patients.length > 0 ? (
					<Select
						onValueChange={(v) => form.setValue("patientId", v)}
						value={form.watch("patientId")}
					>
						<SelectTrigger>
							<SelectValue placeholder="Selecione um paciente" />
						</SelectTrigger>
						<SelectContent>
							{patients.map((p) => (
								<SelectItem key={p.id} value={p.id}>
									{p.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				) : (
					<Input placeholder="ID do paciente" {...form.register("patientId")} />
				)}
				{form.formState.errors.patientId && (
					<p className="text-xs text-destructive">
						{form.formState.errors.patientId.message}
					</p>
				)}
			</div>

			<div className="space-y-1">
				<Label>Observações</Label>
				<Textarea
					placeholder="Instruções ou informações adicionais (opcional)"
					rows={3}
					{...form.register("notes")}
				/>
			</div>

			<div className="flex gap-2 pt-2">
				<Button type="submit" disabled={isPending} className="flex-1">
					{isPending ? "Criando..." : "Criar solicitação"}
				</Button>
				<Button type="button" variant="outline" onClick={onClose}>
					Cancelar
				</Button>
			</div>
		</form>
	);
}
