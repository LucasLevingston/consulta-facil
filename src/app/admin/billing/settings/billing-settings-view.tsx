"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Settings } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import PageHeader from "@/components/custom/page-header";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
	type UpdateBillingSettingsValues,
	updateBillingSettingsSchema,
} from "@/features/billing";
import { BillingSettingsFormFields } from "./billing-settings-form-fields";
import { useBillingSettings } from "./use-billing-settings";
import { useUpdateBillingSettings } from "./use-update-billing-settings";

function AdminBillingSettingsContent() {
	const { data: settings } = useBillingSettings();
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
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<BillingSettingsFormFields control={form.control} />
					<Button type="submit" disabled={updateSettings.isPending}>
						{updateSettings.isPending ? "Salvando..." : "Salvar"}
					</Button>
				</form>
			</Form>
		</div>
	);
}

export function AdminBillingSettingsView() {
	return (
		<SuspenseBoundary>
			<AdminBillingSettingsContent />
		</SuspenseBoundary>
	);
}
