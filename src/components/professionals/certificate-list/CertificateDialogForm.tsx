"use client";

import type { UseFormReturn } from "react-hook-form";
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
import type { ProfessionalCertificateInput } from "@/features/professionals";
import { CertificateOptionalFields } from "./CertificateOptionalFields";

interface Props {
	form: UseFormReturn<ProfessionalCertificateInput>;
	onSubmit: (data: ProfessionalCertificateInput) => void;
	isPending: boolean;
	onClose: () => void;
}

export function CertificateDialogForm({
	form,
	onSubmit,
	isPending,
	onClose,
}: Props) {
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Título</FormLabel>
							<FormControl>
								<Input placeholder="ACLS, BLS, MBA..." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<CertificateOptionalFields form={form} />
				<div className="flex justify-end gap-2">
					<Button type="button" variant="outline" onClick={onClose}>
						Cancelar
					</Button>
					<Button type="submit" disabled={isPending}>
						{isPending ? "Salvando..." : "Salvar"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
