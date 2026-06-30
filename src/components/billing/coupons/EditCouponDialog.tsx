"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
	type UpdateCouponData,
	updateCouponSchema,
	useAdminUpdateCoupon,
} from "@/features/billing";
import type { EditCouponDialogProps } from "./EditCouponDialog.types";

export function EditCouponDialog({ coupon }: EditCouponDialogProps) {
	const [open, setOpen] = useState(false);
	const update = useAdminUpdateCoupon();

	const form = useForm<UpdateCouponData>({
		resolver: zodResolver(updateCouponSchema),
		defaultValues: {
			description: coupon.description ?? "",
			status: coupon.status,
			maxUses: coupon.maxUses ?? undefined,
			expiresAt: coupon.expiresAt ? coupon.expiresAt.split("T")[0] : "",
		},
	});

	function onSubmit(data: UpdateCouponData) {
		update.mutate({ id: coupon.id, data }, { onSuccess: () => setOpen(false) });
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost" size="sm">
					Editar
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Editar Cupom — {coupon.code}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Descrição</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="status"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Status</FormLabel>
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
												<SelectItem value="ACTIVE">Ativo</SelectItem>
												<SelectItem value="INACTIVE">Inativo</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
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
							disabled={update.isPending}
						>
							{update.isPending ? "Salvando..." : "Salvar"}
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
