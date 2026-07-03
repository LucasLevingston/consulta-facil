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
import type { EmergencyContactInput } from "@/features/patients";
import { EmergencyContactPhoneFields } from "./EmergencyContactPhoneFields";

interface Props {
	form: UseFormReturn<EmergencyContactInput>;
	onSubmit: (data: EmergencyContactInput) => void;
	isPending: boolean;
	onClose: () => void;
}

export function EmergencyContactDialogForm({
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
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nome</FormLabel>
							<FormControl>
								<Input placeholder="Maria Silva" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<EmergencyContactPhoneFields control={form.control} />
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>E-mail (opcional)</FormLabel>
							<FormControl>
								<Input
									placeholder="contato@email.com"
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
