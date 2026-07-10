"use client";

import type { FormEventHandler } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { CreateProcedureRequestInput } from "@/features/procedure-requests";
import { CreateProcedureRequestPatientField } from "./CreateProcedureRequestPatientField";

type Service = { id: string; name: string; price: number };

interface Props {
	form: UseFormReturn<CreateProcedureRequestInput>;
	services: Service[];
	patients: { id: string; name: string }[];
	isPending: boolean;
	onClose: () => void;
	onSubmit: FormEventHandler<HTMLFormElement>;
}

export function CreateProcedureRequestFormFields({
	form,
	services,
	patients,
	isPending,
	onClose,
	onSubmit,
}: Props) {
	const serviceError = form.formState.errors.serviceId?.message;
	return (
		<form onSubmit={onSubmit} className="space-y-4">
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
						{services.length === 0 && (
							<SelectItem value="_none" disabled>
								Nenhum serviço requer consulta prévia
							</SelectItem>
						)}
						{services.map((s) => (
							<SelectItem key={s.id} value={s.id}>
								{s.name} — R$ {s.price.toFixed(2)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{serviceError && (
					<p className="text-xs text-destructive">{serviceError}</p>
				)}
			</div>
			<CreateProcedureRequestPatientField form={form} patients={patients} />
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
