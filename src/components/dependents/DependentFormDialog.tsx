"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useDependentForm } from "@/hooks/use-dependent-form";
import type { DependentFormDialogProps } from "./DependentFormDialog.types";
import { DependentFormFields } from "./DependentFormFields";

export function DependentFormDialog({
	open,
	onClose,
	editing,
}: DependentFormDialogProps) {
	const { form, onSubmit, isPending } = useDependentForm({ editing, onClose });

	return (
		<Dialog open={open} onOpenChange={(v) => !v && onClose()}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>
						{editing ? "Editar dependente" : "Adicionar dependente"}
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<DependentFormFields control={form.control} />
						<div className="flex justify-end gap-2 pt-2">
							<Button type="button" variant="outline" onClick={onClose}>
								Cancelar
							</Button>
							<Button type="submit" disabled={isPending}>
								{isPending ? "Salvando..." : "Salvar"}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
