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
import { useUpdateAddress } from "@/features/professionals";
import {
	type UpdateAddressInput,
	updateAddressSchema,
} from "@/lib/schemas/doctor/update-address.schema";
import type { AddressFormProps } from "./AddressForm.types";

export function AddressForm({ professional }: AddressFormProps) {
	const { mutate, isPending } = useUpdateAddress();

	const form = useForm<UpdateAddressInput>({
		resolver: zodResolver(updateAddressSchema),
		defaultValues: {
			city: professional.city ?? "",
			state: professional.state ?? "",
			address: professional.address ?? "",
			zipCode: professional.zipCode ?? "",
			neighborhood: professional.neighborhood ?? "",
			streetNumber: professional.streetNumber ?? "",
			complement: professional.complement ?? "",
		},
	});

	useEffect(() => {
		form.reset({
			city: professional.city ?? "",
			state: professional.state ?? "",
			address: professional.address ?? "",
			zipCode: professional.zipCode ?? "",
			neighborhood: professional.neighborhood ?? "",
			streetNumber: professional.streetNumber ?? "",
			complement: professional.complement ?? "",
		});
	}, [professional, form]);

	function onSubmit(data: UpdateAddressInput) {
		const clean = Object.fromEntries(
			Object.entries(data).map(([k, v]) => [k, v === "" ? null : v]),
		) as UpdateAddressInput;
		mutate(clean, {
			onSuccess: () => toast.success("Endereço atualizado!"),
			onError: () => toast.error("Erro ao salvar endereço."),
		});
	}

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
						<div className="flex gap-4">
							<FormField
								control={form.control}
								name="zipCode"
								render={({ field }) => (
									<FormItem className="w-36">
										<FormLabel>CEP</FormLabel>
										<FormControl>
											<Input
												placeholder="00000-000"
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
								name="address"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>Logradouro</FormLabel>
										<FormControl>
											<Input
												placeholder="Rua, Av..."
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
								name="streetNumber"
								render={({ field }) => (
									<FormItem className="w-24">
										<FormLabel>Número</FormLabel>
										<FormControl>
											<Input
												placeholder="100"
												{...field}
												value={field.value ?? ""}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex gap-4">
							<FormField
								control={form.control}
								name="neighborhood"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>Bairro</FormLabel>
										<FormControl>
											<Input
												placeholder="Bairro"
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
								name="complement"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>Complemento</FormLabel>
										<FormControl>
											<Input
												placeholder="Sala 1, Andar 2..."
												{...field}
												value={field.value ?? ""}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex gap-4">
							<FormField
								control={form.control}
								name="city"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>Cidade</FormLabel>
										<FormControl>
											<Input
												placeholder="São Paulo"
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
								name="state"
								render={({ field }) => (
									<FormItem className="w-24">
										<FormLabel>Estado</FormLabel>
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
