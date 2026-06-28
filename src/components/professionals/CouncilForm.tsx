"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useEffect } from "react";
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
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useUpdateCouncil } from "@/hooks/api/professionals/use-update-council";
import {
	councilTypeOptions,
	type UpdateCouncilInput,
	updateCouncilSchema,
} from "@/lib/schemas/doctor/update-council.schema";
import type { CouncilFormProps } from "./CouncilForm.types";

export function CouncilForm({ professional }: CouncilFormProps) {
	const { mutate, isPending } = useUpdateCouncil();

	const form = useForm<UpdateCouncilInput>({
		resolver: zodResolver(updateCouncilSchema),
		defaultValues: {
			councilType: professional.councilType ?? "",
			councilState: professional.councilState ?? "",
		},
	});

	useEffect(() => {
		form.reset({
			councilType: professional.councilType ?? "",
			councilState: professional.councilState ?? "",
		});
	}, [professional, form]);

	function onSubmit(data: UpdateCouncilInput) {
		mutate(
			{
				councilType: data.councilType || null,
				councilState: data.councilState || null,
			},
			{
				onSuccess: () => toast.success("Conselho atualizado!"),
				onError: () => toast.error("Erro ao salvar conselho."),
			},
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">Conselho profissional</CardTitle>
				<CardDescription>
					Seu conselho de classe (ex: CRM 12345/SP).
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<div className="flex gap-4">
							<FormField
								control={form.control}
								name="councilType"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>Tipo</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value ?? ""}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Selecione" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{councilTypeOptions.map((opt) => (
													<SelectItem key={opt.value} value={opt.value}>
														{opt.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="councilState"
								render={({ field }) => (
									<FormItem className="w-24">
										<FormLabel>UF</FormLabel>
										<FormControl>
											<Input
												placeholder="SP"
												maxLength={2}
												{...field}
												value={field.value ?? ""}
												className="uppercase"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
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
