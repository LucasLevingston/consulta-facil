"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { DependentResponse } from "@/features/dependents";
import {
	type CreateDependentInput,
	createDependentSchema,
	useCreateDependent,
	useUpdateDependent,
} from "@/features/dependents";

interface UseDependentFormProps {
	editing?: DependentResponse | null;
	onClose: () => void;
}

export function useDependentForm({ editing, onClose }: UseDependentFormProps) {
	const create = useCreateDependent();
	const update = useUpdateDependent();

	const form = useForm<CreateDependentInput>({
		resolver: zodResolver(createDependentSchema),
		defaultValues: {
			name: editing?.name ?? "",
			cpf: editing?.cpf ?? "",
			birthDate: editing?.birthDate ?? "",
			gender: (editing?.gender as CreateDependentInput["gender"]) ?? undefined,
			relationship:
				(editing?.relationship as CreateDependentInput["relationship"]) ??
				undefined,
		},
	});

	async function onSubmit(data: CreateDependentInput) {
		try {
			if (editing) {
				await update.mutateAsync({ id: editing.id, data });
				toast.success("Dependente atualizado.");
			} else {
				await create.mutateAsync(data);
				toast.success("Dependente adicionado.");
			}
			form.reset();
			onClose();
		} catch {
			toast.error("Erro ao salvar dependente.");
		}
	}

	return { form, onSubmit, isPending: create.isPending || update.isPending };
}
