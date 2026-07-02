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
import type { UpdateCouponData } from "@/features/billing";
import { EditCouponStatusMaxFields } from "./EditCouponStatusMaxFields";

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
			<EditCouponStatusMaxFields control={control} />
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
