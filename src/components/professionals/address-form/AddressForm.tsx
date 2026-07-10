"use client";

import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { AddressCityFields } from "./AddressCityFields";
import type { AddressFormProps } from "./AddressForm.types";
import { AddressStreetFields } from "./AddressStreetFields";
import { useAddressForm } from "./use-address-form";

export function AddressForm({ professional }: AddressFormProps) {
	const { form, onSubmit, isPending } = useAddressForm(professional);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">Endereço do consultório</CardTitle>
				<CardDescription>
					Localização exibida para pacientes próximos.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<AddressStreetFields control={form.control} />
						<AddressCityFields control={form.control} />
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
