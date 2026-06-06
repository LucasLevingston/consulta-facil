"use client";

import { Banknote, CreditCard, Info } from "lucide-react";
import type { Control } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import type { AppointmentFormValues } from "@/lib/schemas/appointment/appointment-form.schema";
import type { PaymentMethod } from "@/lib/schemas/doctor/payment-method.schema";
import { PAYMENT_METHOD_LABELS } from "@/lib/schemas/doctor/payment-method-labels";
import type { ProfessionalResponse } from "@/lib/schemas/doctor/professional-response.schema";

interface PaymentStepProps {
	control: Control<AppointmentFormValues>;
	selectedDoctor: ProfessionalResponse;
}

export function PaymentStep({ control, selectedDoctor }: PaymentStepProps) {
	if ((selectedDoctor.acceptedPaymentMethods?.length ?? 0) === 0) return null;

	return (
		<div className="space-y-3">
			{selectedDoctor.paymentTiming === "AT_CONSULTATION" && (
				<Alert className="rounded-xl border-blue-500/20 bg-blue-500/5">
					<Info className="h-4 w-4 text-blue-500" />
					<AlertDescription className="text-xs text-blue-700 dark:text-blue-400">
						O pagamento é realizado presencialmente no dia da consulta.
					</AlertDescription>
				</Alert>
			)}
			{selectedDoctor.paymentTiming === "AT_SCHEDULING" && (
				<Alert className="rounded-xl border-amber-500/20 bg-amber-500/5">
					<CreditCard className="h-4 w-4 text-amber-500" />
					<AlertDescription className="text-xs text-amber-700 dark:text-amber-400">
						Este profissional exige pagamento no momento do agendamento.
					</AlertDescription>
				</Alert>
			)}
			<FormField
				control={control}
				name="chosenPaymentMethod"
				render={({ field }) => (
					<FormItem>
						<div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
							{(selectedDoctor.acceptedPaymentMethods ?? []).map((method) => (
								<button
									key={method}
									type="button"
									onClick={() =>
										field.onChange(field.value === method ? undefined : method)
									}
									className={`flex items-center gap-2 rounded-xl border p-3 text-left text-sm transition-colors ${
										field.value === method
											? "border-primary bg-primary/5 text-primary"
											: "border-border hover:border-primary/40"
									}`}
								>
									{method === "MERCADOPAGO" ? (
										<CreditCard className="h-4 w-4 shrink-0" />
									) : (
										<Banknote className="h-4 w-4 shrink-0" />
									)}
									<span className="font-medium">
										{PAYMENT_METHOD_LABELS[method as PaymentMethod]}
									</span>
								</button>
							))}
						</div>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
