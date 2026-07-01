"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { UseAppointmentFormSetupReturn } from "@/features/appointments";
import { PaymentStep } from "./steps/PaymentStep";

interface Props {
	hook: UseAppointmentFormSetupReturn;
}

export function AppointmentCancelStep({ hook }: Props) {
	const { form, onSubmit, isPending, selectedProfessional } = hook;

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="cancellationReason"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-sm font-semibold text-primary">
								Motivo do cancelamento
							</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Descreva o motivo do cancelamento..."
									className="min-h-[120px] resize-none rounded-xl border-border"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{selectedProfessional && (
					<PaymentStep
						control={form.control}
						selectedProfessional={selectedProfessional}
					/>
				)}
				<Button
					type="submit"
					variant="destructive"
					className="w-full rounded-xl"
					disabled={isPending}
				>
					{isPending ? "Cancelando..." : "Cancelar Consulta"}
				</Button>
			</form>
		</Form>
	);
}
