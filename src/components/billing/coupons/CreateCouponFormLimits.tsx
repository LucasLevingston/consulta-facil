"use client";

import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { CreateCouponData } from "@/features/billing";

interface Props {
	form: UseFormReturn<CreateCouponData>;
	isPending: boolean;
}

export function CreateCouponFormLimits({ form, isPending }: Props) {
	return (
		<>
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
			<Button type="submit" className="w-full" disabled={isPending}>
				{isPending ? "Criando..." : "Criar Cupom"}
			</Button>
		</>
	);
}
