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
				<FormField
					control={form.control}
					name="issuingOrganization"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Instituição emissora</FormLabel>
							<FormControl>
								<Input
									placeholder="AHA, CFM..."
									{...field}
									value={field.value ?? ""}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="issueYear"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ano de emissão</FormLabel>
							<FormControl>
								<Input
									type="number"
									placeholder="2021"
									value={field.value ?? ""}
									onChange={(e) =>
										field.onChange(
											e.target.value === "" ? null : Number(e.target.value),
										)
									}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="certificateUrl"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Link do certificado (opcional)</FormLabel>
							<FormControl>
								<Input
									placeholder="https://..."
									{...field}
									value={field.value ?? ""}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
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
