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
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useUpdatePaymentSettings } from "@/hooks/api/services/use-update-payment-settings";
import { PAYMENT_METHOD_LABELS } from "@/lib/constants/payment-method-labels";
import type { PaymentMethod } from "@/lib/schemas/doctor/payment-method.schema";
import type { PaymentTiming } from "@/lib/schemas/doctor/payment-timing.schema";
import {
	type UpdatePaymentSettingsInput,
	updatePaymentSettingsSchema,
} from "@/lib/schemas/doctor/update-payment-settings.schema";

import { ALL_METHODS } from "@/utils/constants/payment-methods";

const TIMING_OPTIONS: { value: PaymentTiming; label: string; desc: string }[] =
	[
		{
			value: "AT_SCHEDULING",
			label: "No agendamento",
			desc: "Paciente paga ao marcar a consulta",
		},
		{
			value: "AT_CONSULTATION",
			label: "Na consulta",
			desc: "Paciente paga presencialmente no dia",
		},
	];

export function PaymentSettingsCard({
	acceptedPaymentMethods,
	paymentTiming,
}: {
	acceptedPaymentMethods: PaymentMethod[];
	paymentTiming: PaymentTiming | null | undefined;
}) {
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
						<FormField
							control={form.control}
							name="paymentTiming"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-medium">
										Momento do pagamento
									</FormLabel>
									<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
										{TIMING_OPTIONS.map((opt) => (
											<button
												key={opt.value}
												type="button"
												onClick={() => field.onChange(opt.value)}
												className={`flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-colors ${
													field.value === opt.value
														? "border-primary bg-primary/5 text-primary"
														: "border-border hover:border-primary/40"
												}`}
											>
												<span className="text-sm font-semibold">
													{opt.label}
												</span>
												<span className="text-xs text-muted-foreground">
													{opt.desc}
												</span>
											</button>
										))}
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="acceptedPaymentMethods"
							render={() => (
								<FormItem>
									<FormLabel className="text-sm font-medium">
										Métodos aceitos
									</FormLabel>
									<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
										{ALL_METHODS.map((method) => (
											<FormField
												key={method}
												control={form.control}
												name="acceptedPaymentMethods"
												render={({ field }) => {
													const checked = field.value.includes(method);
													return (
														<FormItem className="flex items-center gap-2 space-y-0 rounded-lg border border-border p-3">
															<FormControl>
																<Checkbox
																	checked={checked}
																	onCheckedChange={(val) => {
																		const current =
																			field.value as PaymentMethod[];
																		field.onChange(
																			val
																				? [...current, method]
																				: current.filter((m) => m !== method),
																		);
																	}}
																/>
															</FormControl>
															<FormLabel className="cursor-pointer text-sm font-normal">
																{PAYMENT_METHOD_LABELS[method]}
															</FormLabel>
														</FormItem>
													);
												}}
											/>
										))}
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>

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
