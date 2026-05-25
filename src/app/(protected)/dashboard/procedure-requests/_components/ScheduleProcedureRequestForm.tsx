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
import { useScheduleProcedureRequest } from "@/hooks/api/use-procedure-requests";
import {
	type ScheduleProcedureRequestInput,
	scheduleProcedureRequestSchema,
} from "@/lib/schemas/procedure-request.schema";

export function ScheduleProcedureRequestForm({
	requestId,
	serviceName,
	onClose,
}: {
	requestId: string;
	serviceName: string;
	onClose: () => void;
}) {
	const { mutateAsync: schedule, isPending } = useScheduleProcedureRequest();

	const form = useForm<ScheduleProcedureRequestInput>({
		resolver: zodResolver(scheduleProcedureRequestSchema),
		defaultValues: { scheduledAt: "", modality: undefined },
	});

	async function onSubmit(values: ScheduleProcedureRequestInput) {
		try {
			await schedule({ requestId, data: values });
			toast.success("Procedimento agendado!");
			onClose();
		} catch {
			toast.error("Erro ao agendar procedimento.");
		}
	}

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
			<p className="text-sm text-muted-foreground">
				Serviço:{" "}
				<span className="font-medium text-foreground">{serviceName}</span>
			</p>

			<div className="space-y-1">
				<Label htmlFor="scheduledAt">Data e hora *</Label>
				<Input
					id="scheduledAt"
					type="datetime-local"
					className="h-11"
					{...form.register("scheduledAt")}
					onChange={(e) => {
						const iso = e.target.value
							? new Date(e.target.value).toISOString()
							: "";
						form.setValue("scheduledAt", iso);
					}}
				/>
				{form.formState.errors.scheduledAt && (
					<p className="text-xs text-destructive">
						{form.formState.errors.scheduledAt.message}
					</p>
				)}
			</div>

			<div className="space-y-1">
				<Label>Modalidade</Label>
				<Select
					onValueChange={(v) =>
						form.setValue("modality", v as "IN_PERSON" | "ONLINE")
					}
					value={form.watch("modality") ?? ""}
				>
					<SelectTrigger>
						<SelectValue placeholder="Selecione (opcional)" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="IN_PERSON">Presencial</SelectItem>
						<SelectItem value="ONLINE">Online</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="flex gap-2 pt-2">
				<Button type="submit" disabled={isPending} className="flex-1">
					{isPending ? "Agendando..." : "Confirmar agendamento"}
				</Button>
				<Button type="button" variant="outline" onClick={onClose}>
					Cancelar
				</Button>
			</div>
		</form>
	);
}
