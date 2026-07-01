"use client";

import type { FormEventHandler } from "react";
import type { Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
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
import type { UpdateCouponData } from "@/features/billing";

interface Props {
	control: Control<UpdateCouponData>;
	onSubmit: FormEventHandler<HTMLFormElement>;
	isPending: boolean;
}

export function EditCouponForm({ control, onSubmit, isPending }: Props) {
	return (
		<form onSubmit={onSubmit} className="space-y-4">
			<FormField
				control={control}
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
					control={control}
					name="status"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Status</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
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
					control={control}
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
				control={control}
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
			<Button type="submit" className="w-full" disabled={isPending}>
				{isPending ? "Salvando..." : "Salvar"}
			</Button>
		</form>
	);
}
