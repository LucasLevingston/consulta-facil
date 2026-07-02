"use client";

import type { UseFormReturn } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { CreateCouponData } from "@/features/billing";
import { CouponTypeValueGrid } from "./CouponTypeValueGrid";

interface Props {
	form: UseFormReturn<CreateCouponData>;
}
export function CreateCouponFormBasic({ form }: Props) {
	return (
		<>
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
								onChange={(e) => field.onChange(e.target.value.toUpperCase())}
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
			<CouponTypeValueGrid control={form.control} />
		</>
	);
}
