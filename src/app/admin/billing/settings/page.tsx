"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Settings } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import PageHeader from "@/components/custom/page-header";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
	useBillingSettings,
	useUpdateBillingSettings,
} from "@/hooks/api/billing/use-billing-settings";
import {
	type UpdateBillingSettingsValues,
	updateBillingSettingsSchema,
} from "@/lib/schemas/billing/billing-settings.schema";

export default function AdminBillingSettingsPage() {
	const { data: settings, isLoading } = useBillingSettings();
	const updateSettings = useUpdateBillingSettings();

	const form = useForm<UpdateBillingSettingsValues>({
		resolver: zodResolver(updateBillingSettingsSchema),
		defaultValues: {
			defaultCurrency: "BRL",
			defaultGateway: "MOCK",
			pixExpirationMinutes: 30,
			invoiceExpirationDays: 7,
			defaultTrialDays: 14,
		},
	});

	useEffect(() => {
		if (settings) {
			form.reset({
				defaultCurrency: settings.defaultCurrency,
				defaultGateway: settings.defaultGateway,
				pixExpirationMinutes: settings.pixExpirationMinutes,
				invoiceExpirationDays: settings.invoiceExpirationDays,
				defaultTrialDays: settings.defaultTrialDays,
			});
		}
	}, [settings, form]);

	function onSubmit(values: UpdateBillingSettingsValues) {
		updateSettings.mutate(values, {
			onSuccess: () => toast.success("Configurações salvas"),
			onError: () => toast.error("Erro ao salvar configurações"),
		});
	}

	return (
		<div className="space-y-6 p-6 max-w-xl">
			<PageHeader
				title="Configurações de Cobrança"
				description="Parâmetros globais do módulo financeiro."
				icon={<Settings className="h-6 w-6" />}
			/>
			{isLoading && <Skeleton className="h-96 w-full" />}
			{!isLoading && (
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="defaultCurrency"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Moeda padrão</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="defaultGateway"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Gateway padrão</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="pixExpirationMinutes"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Expiração PIX (minutos)</FormLabel>
									<FormControl>
										<Input
											type="number"
											{...field}
											onChange={(e) => field.onChange(Number(e.target.value))}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="invoiceExpirationDays"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Expiração de cobrança (dias)</FormLabel>
									<FormControl>
										<Input
											type="number"
											{...field}
											onChange={(e) => field.onChange(Number(e.target.value))}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="defaultTrialDays"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Dias de trial padrão</FormLabel>
									<FormControl>
										<Input
											type="number"
											{...field}
											onChange={(e) => field.onChange(Number(e.target.value))}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" disabled={updateSettings.isPending}>
							{updateSettings.isPending ? "Salvando..." : "Salvar"}
						</Button>
					</form>
				</Form>
			)}
		</div>
	);
}
