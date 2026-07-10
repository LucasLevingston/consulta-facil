"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard } from "lucide-react";
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
import { Form } from "@/components/ui/form";
import {
	type UpdatePaymentSettingsInput,
	updatePaymentSettingsSchema,
} from "@/features/professionals";
import { PaymentMethodsField } from "./PaymentMethodsField";
import type { PaymentSettingsCardProps } from "./PaymentSettingsCard.types";
import { PaymentTimingField } from "./PaymentTimingField";
import { useUpdatePaymentSettings } from "./use-update-payment-settings";

export function PaymentSettingsCard({
	acceptedPaymentMethods,
	paymentTiming,
}: PaymentSettingsCardProps) {
	const { mutateAsync: updateSettings, isPending } = useUpdatePaymentSettings();

	const form = useForm<UpdatePaymentSettingsInput>({
		resolver: zodResolver(updatePaymentSettingsSchema),
		defaultValues: {
			paymentTiming: paymentTiming ?? "AT_CONSULTATION",
			acceptedPaymentMethods:
				acceptedPaymentMethods.length > 0 ? acceptedPaymentMethods : [],
		},
	});

	async function onSubmit(values: UpdatePaymentSettingsInput) {
		try {
			await updateSettings(values);
			toast.success("Configurações de pagamento atualizadas!");
		} catch {
			toast.error("Erro ao atualizar configurações.");
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-base">
					<CreditCard className="h-4 w-4" />
					Configurações de Pagamento
				</CardTitle>
				<CardDescription>
					Defina como e quando os pacientes pagam pelas consultas.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<PaymentTimingField control={form.control} />
						<PaymentMethodsField control={form.control} />
						<Button
							type="submit"
							disabled={isPending || !form.formState.isDirty}
						>
							{isPending ? "Salvando..." : "Salvar configurações"}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
