"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateService } from "@/hooks/api/services/use-create-service";
import { useUpdateService } from "@/hooks/api/services/use-update-service";
import {
	type CreateServiceInput,
	createServiceSchema,
} from "@/lib/schemas/service/create-service.schema";
import type { ProfessionalService } from "@/lib/schemas/service/professional-service.schema";

export function ServiceForm({
	existing,
	onClose,
}: {
	existing?: ProfessionalService;
	onClose: () => void;
}) {
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

			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-1">
					<Label htmlFor="price">Preço (R$) *</Label>
					<Input
						id="price"
						type="number"
						min={0}
						step={0.01}
						{...form.register("price", { valueAsNumber: true })}
					/>
					{form.formState.errors.price && (
						<p className="text-xs text-destructive">
							{form.formState.errors.price.message}
						</p>
					)}
				</div>
				<div className="space-y-1">
					<Label htmlFor="duration">Duração (min) *</Label>
					<Input
						id="duration"
						type="number"
						min={1}
						{...form.register("durationMinutes", { valueAsNumber: true })}
					/>
					{form.formState.errors.durationMinutes && (
						<p className="text-xs text-destructive">
							{form.formState.errors.durationMinutes.message}
						</p>
					)}
				</div>
			</div>

			<div className="flex items-center gap-2">
				<Checkbox
					id="requiresConsultation"
					checked={form.watch("requiresConsultation")}
					onCheckedChange={(v) => form.setValue("requiresConsultation", !!v)}
				/>
				<Label
					htmlFor="requiresConsultation"
					className="cursor-pointer text-sm"
				>
					Requer consulta prévia
				</Label>
			</div>

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
