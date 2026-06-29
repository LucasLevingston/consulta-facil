"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useEffect } from "react";
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
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
	useMedicalRecords,
	useUpdateMedicalRecords,
} from "@/features/patients";
import type { MedicalRecord } from "@/lib/schemas/patient/medical-record.schema";
import {
	type UpdateMedicalRecordInput,
	updateMedicalRecordSchema,
} from "@/lib/schemas/patient/update-medical-record.schema";
import type { MedicalHealthFormProps } from "./MedicalHealthForm.types";

const BLOOD_TYPE_LABELS: Record<string, string> = {
	A_POSITIVE: "A+",
	A_NEGATIVE: "A-",
	B_POSITIVE: "B+",
	B_NEGATIVE: "B-",
	AB_POSITIVE: "AB+",
	AB_NEGATIVE: "AB-",
	O_POSITIVE: "O+",
	O_NEGATIVE: "O-",
};

function getBmiLabel(bmi: number): string {
	if (bmi < 18.5) return "Abaixo do peso";
	if (bmi < 25) return "Normal";
	if (bmi < 30) return "Sobrepeso";
	return "Obesidade";
}

function toNumber(v: unknown): number | null {
	if (v === null || v === undefined || v === "") return null;
	const n = Number(v);
	return Number.isNaN(n) ? null : n;
}

export function MedicalHealthForm({ userId }: MedicalHealthFormProps) {
	const { data: record } = useMedicalRecords(userId);
	const { mutate, isPending } = useUpdateMedicalRecords(userId);

	const form = useForm<UpdateMedicalRecordInput>({
		resolver: zodResolver(updateMedicalRecordSchema),
		defaultValues: {
			bloodType: null,
			height: null,
			weight: null,
			allergies: "",
			currentMedication: "",
			familyMedicalHistory: "",
			pastMedicalHistory: "",
		},
	});

	useEffect(() => {
		if (record) {
			form.reset({
				bloodType: (record as MedicalRecord).bloodType ?? null,
				height: (record as MedicalRecord).height ?? null,
				weight: (record as MedicalRecord).weight ?? null,
				allergies: record.allergies ?? "",
				currentMedication: record.currentMedication ?? "",
				familyMedicalHistory: record.familyMedicalHistory ?? "",
				pastMedicalHistory: record.pastMedicalHistory ?? "",
			});
		}
	}, [record, form]);

	const height = form.watch("height");
	const weight = form.watch("weight");
	const bmi =
		height && weight && height > 0 ? weight / (height * height) : null;

	function onSubmit(data: UpdateMedicalRecordInput) {
		mutate(data, {
			onSuccess: () => toast.success("Dados de saúde atualizados!"),
			onError: () => toast.error("Erro ao salvar."),
		});
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">Dados de saúde</CardTitle>
				<CardDescription>
					Tipo sanguíneo, altura, peso e histórico médico.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<div className="flex gap-4 flex-wrap">
							<FormField
								control={form.control}
								name="bloodType"
								render={({ field }) => (
									<FormItem className="flex-1 min-w-[140px]">
										<FormLabel>Tipo sanguíneo</FormLabel>
										<Select
											onValueChange={(v) =>
												field.onChange(v === "__none__" ? null : v)
											}
											value={field.value ?? "__none__"}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Selecione" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="__none__">Não informado</SelectItem>
												{Object.entries(BLOOD_TYPE_LABELS).map(([k, v]) => (
													<SelectItem key={k} value={k}>
														{v}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="height"
								render={({ field }) => (
									<FormItem className="w-28">
										<FormLabel>Altura (m)</FormLabel>
										<FormControl>
											<Input
												type="number"
												step="0.01"
												placeholder="1.75"
												value={field.value ?? ""}
												onChange={(e) =>
													field.onChange(toNumber(e.target.value))
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="weight"
								render={({ field }) => (
									<FormItem className="w-28">
										<FormLabel>Peso (kg)</FormLabel>
										<FormControl>
											<Input
												type="number"
												step="0.1"
												placeholder="70.0"
												value={field.value ?? ""}
												onChange={(e) =>
													field.onChange(toNumber(e.target.value))
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{bmi !== null && (
								<div className="flex flex-col justify-end pb-1">
									<p className="text-sm font-medium">
										IMC: {bmi.toFixed(1)}{" "}
										<span className="text-muted-foreground font-normal">
											({getBmiLabel(bmi)})
										</span>
									</p>
								</div>
							)}
						</div>

						<FormField
							control={form.control}
							name="allergies"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Alergias</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Penicilina, amendoim..."
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
							name="currentMedication"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Medicações atuais</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Ibuprofeno 200mg..."
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
							name="pastMedicalHistory"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Histórico médico anterior</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Cirurgias, diagnósticos anteriores..."
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
							name="familyMedicalHistory"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Histórico médico familiar</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Doenças hereditárias..."
											{...field}
											value={field.value ?? ""}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" disabled={isPending} className="gap-2">
							<Save className="h-4 w-4" />
							{isPending ? "Salvando..." : "Salvar"}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
