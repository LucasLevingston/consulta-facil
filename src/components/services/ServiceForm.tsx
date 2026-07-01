"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	type CreateServiceInput,
	createServiceSchema,
	useCreateService,
	useUpdateService,
} from "@/features/services";
import type { ServiceFormProps } from "./ServiceForm.types";
import { ServiceFormCheckbox } from "./ServiceFormCheckbox";
import { ServiceFormPriceGrid } from "./ServiceFormPriceGrid";

export function ServiceForm({ existing, onClose }: ServiceFormProps) {
	const { mutateAsync: create, isPending: creating } = useCreateService();
	const { mutateAsync: update, isPending: updating } = useUpdateService();

	const form = useForm<CreateServiceInput>({
		resolver: zodResolver(createServiceSchema),
		defaultValues: existing
			? {
					name: existing.name,
					description: existing.description ?? "",
					price: existing.price,
					durationMinutes: existing.durationMinutes,
					requiresConsultation: existing.requiresConsultation,
				}
			: {
					name: "",
					description: "",
					price: 0,
					durationMinutes: 30,
					requiresConsultation: false,
				},
	});

	async function onSubmit(values: CreateServiceInput) {
		try {
			if (existing) {
				await update({ serviceId: existing.id, data: values });
				toast.success("Serviço atualizado!");
			} else {
				await create(values);
				toast.success("Serviço criado!");
			}
			onClose();
		} catch {
			toast.error("Erro ao salvar serviço.");
		}
	}

	const isPending = creating || updating;

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
			<div className="space-y-1">
				<Label htmlFor="name">Nome *</Label>
				<Input
					id="name"
					{...form.register("name")}
					placeholder="Ex: Limpeza de pele"
				/>
				{form.formState.errors.name && (
					<p className="text-xs text-destructive">
						{form.formState.errors.name.message}
					</p>
				)}
			</div>
			<div className="space-y-1">
				<Label htmlFor="description">Descrição</Label>
				<Input
					id="description"
					{...form.register("description")}
					placeholder="Opcional"
				/>
			</div>
			<ServiceFormPriceGrid form={form} />
			<ServiceFormCheckbox form={form} />
			<div className="flex gap-2 pt-2">
				<Button type="submit" disabled={isPending} className="flex-1">
					{isPending ? "Salvando..." : existing ? "Atualizar" : "Criar serviço"}
				</Button>
				<Button type="button" variant="outline" onClick={onClose}>
					Cancelar
				</Button>
			</div>
		</form>
	);
}
