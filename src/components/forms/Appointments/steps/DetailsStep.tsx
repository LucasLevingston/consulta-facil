"use client";

import { FileText } from "lucide-react";
import type { Control } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { AppointmentFormValues } from "@/lib/schemas/appointment.schema";

interface DetailsStepProps {
	control: Control<AppointmentFormValues>;
}

export function DetailsStep({ control }: DetailsStepProps) {
	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2">
				<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
					5
				</div>
				<h3 className="font-semibold text-foreground">Detalhes</h3>
				<Badge variant="secondary" className="text-xs">
					Opcional
				</Badge>
			</div>

			<FormField
				control={control}
				name="reason"
				render={({ field }) => (
					<FormItem>
						<FormLabel className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
							<FileText className="h-3.5 w-3.5" />
							Motivo da consulta
						</FormLabel>
						<FormControl>
							<Textarea
								placeholder="Ex.: dor de cabeça frequente, check-up anual, retorno..."
								className="min-h-[100px] resize-none rounded-xl border-border focus-visible:ring-primary/30"
								maxLength={500}
								{...field}
								value={field.value ?? ""}
							/>
						</FormControl>
						<div className="flex justify-between items-center">
							<FormMessage />
							<span className="text-xs text-muted-foreground ml-auto">
								{(field.value ?? "").length}/500
							</span>
						</div>
					</FormItem>
				)}
			/>

			<FormField
				control={control}
				name="notes"
				render={({ field }) => (
					<FormItem>
						<FormLabel className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
							<FileText className="h-3.5 w-3.5" />
							Observações adicionais
						</FormLabel>
						<FormControl>
							<Textarea
								placeholder="Informações relevantes, alergias, medicações em uso..."
								className="min-h-[90px] resize-none rounded-xl border-border focus-visible:ring-primary/30"
								{...field}
								value={field.value ?? ""}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
