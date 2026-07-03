"use client";

import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { MedicalHistorySectionProps } from "./MedicalHistorySection.types";

export function MedicalHistorySection({
	control,
	isPending,
}: MedicalHistorySectionProps) {
	return (
		<>
			<FormField
				control={control}
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
				control={control}
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
				control={control}
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
				control={control}
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
		</>
	);
}
