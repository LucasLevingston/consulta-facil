"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Syringe, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	type PatientVaccineInput,
	patientVaccineSchema,
	useAddVaccine,
	useDeleteVaccine,
	useVaccines,
} from "@/features/patients";
import type { VaccineDialogProps } from "./VaccineList.types";

function VaccineDialog({ open, onClose }: VaccineDialogProps) {
	const add = useAddVaccine();

	const form = useForm<PatientVaccineInput>({
		resolver: zodResolver(patientVaccineSchema),
		defaultValues: {
			vaccineName: "",
			doseNumber: "",
			administeredAt: "",
			notes: "",
		},
	});

	function onSubmit(data: PatientVaccineInput) {
		add.mutate(data, {
			onSuccess: () => {
				toast.success("Vacina adicionada!");
				form.reset();
				onClose();
			},
			onError: () => toast.error("Erro ao adicionar."),
		});
	}

	return (
		<Dialog open={open} onOpenChange={(o) => !o && onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Nova vacina</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="vaccineName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nome da vacina</FormLabel>
									<FormControl>
										<Input
											placeholder="COVID-19, Influenza, Tétano..."
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex gap-4">
							<FormField
								control={form.control}
								name="doseNumber"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>Dose (opcional)</FormLabel>
										<FormControl>
											<Input
												placeholder="1ª dose, reforço..."
												{...field}
												value={field.value ?? ""}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="administeredAt"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>Data (opcional)</FormLabel>
										<FormControl>
											<Input type="date" {...field} value={field.value ?? ""} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="notes"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Observações (opcional)</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Reações, local de aplicação..."
											{...field}
											value={field.value ?? ""}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-end gap-2">
							<Button type="button" variant="outline" onClick={onClose}>
								Cancelar
							</Button>
							<Button type="submit" disabled={add.isPending}>
								{add.isPending ? "Salvando..." : "Salvar"}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export function VaccineList() {
	const { data: vaccines = [] } = useVaccines();
	const deleteVaccine = useDeleteVaccine();
	const [dialogOpen, setDialogOpen] = useState(false);

	function handleDelete(id: string) {
		deleteVaccine.mutate(id, {
			onSuccess: () => toast.success("Vacina removida."),
			onError: () => toast.error("Erro ao remover."),
		});
	}

	return (
		<>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle className="text-base">Vacinas</CardTitle>
						<CardDescription>Registro de vacinas tomadas.</CardDescription>
					</div>
					<Button
						size="sm"
						variant="outline"
						onClick={() => setDialogOpen(true)}
						className="gap-1"
					>
						<Plus className="h-4 w-4" />
						Adicionar
					</Button>
				</CardHeader>
				<CardContent>
					{vaccines.length === 0 ? (
						<p className="text-sm text-muted-foreground text-center py-4">
							Nenhuma vacina registrada.
						</p>
					) : (
						<ul className="space-y-3">
							{vaccines.map((v) => (
								<li
									key={v.id}
									className="flex items-start justify-between gap-4 rounded-lg border p-3"
								>
									<div className="flex items-start gap-3">
										<Syringe className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
										<div>
											<p className="text-sm font-medium">
												{v.vaccineName}
												{v.doseNumber ? ` – ${v.doseNumber}` : ""}
											</p>
											{(v.administeredAt || v.notes) && (
												<p className="text-xs text-muted-foreground">
													{v.administeredAt ? v.administeredAt : ""}
													{v.notes
														? v.administeredAt
															? ` · ${v.notes}`
															: v.notes
														: ""}
												</p>
											)}
										</div>
									</div>
									<Button
										size="icon"
										variant="ghost"
										className="h-7 w-7 text-destructive hover:text-destructive shrink-0"
										onClick={() => v.id && handleDelete(v.id)}
										disabled={deleteVaccine.isPending}
									>
										<Trash2 className="h-3.5 w-3.5" />
									</Button>
								</li>
							))}
						</ul>
					)}
				</CardContent>
			</Card>

			<VaccineDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
		</>
	);
}
