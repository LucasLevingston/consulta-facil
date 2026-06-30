"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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
import {
	type CreateCouponData,
	createCouponSchema,
	useAdminCreateCoupon,
} from "@/features/billing";

export function CreateCouponDialog() {
	const [open, setOpen] = useState(false);
	const create = useAdminCreateCoupon();

	const form = useForm<CreateCouponData>({
		resolver: zodResolver(createCouponSchema),
		defaultValues: { type: "PERCENT", maxUsesPerUser: 1 },
	});

	function onSubmit(data: CreateCouponData) {
		create.mutate(data, {
			onSuccess: () => {
				setOpen(false);
				form.reset();
			},
		});
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="sm" className="gap-2">
					<Plus className="h-4 w-4" />
					Novo Cupom
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Criar Cupom</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="code"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Código</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="DESCONTO20"
											onChange={(e) =>
												field.onChange(e.target.value.toUpperCase())
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Descrição</FormLabel>
									<FormControl>
										<Input {...field} placeholder="Cupom de desconto" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tipo</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="PERCENT">Percentual (%)</SelectItem>
												<SelectItem value="FIXED">Fixo (R$)</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="value"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Valor</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="number"
												min="0.01"
												step="0.01"
												onChange={(e) => field.onChange(e.target.valueAsNumber)}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="maxUses"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Máx. usos total</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="number"
												min="1"
												placeholder="Ilimitado"
												onChange={(e) =>
													field.onChange(
														Number.isNaN(e.target.valueAsNumber)
															? undefined
															: e.target.valueAsNumber,
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
								name="maxUsesPerUser"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Máx. por usuário</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="number"
												min="1"
												onChange={(e) => field.onChange(e.target.valueAsNumber)}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="expiresAt"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Expira em</FormLabel>
									<FormControl>
										<Input {...field} type="date" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							className="w-full"
							disabled={create.isPending}
						>
							{create.isPending ? "Criando..." : "Criar Cupom"}
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
