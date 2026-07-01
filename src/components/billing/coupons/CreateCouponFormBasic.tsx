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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { CreateCouponData } from "@/features/billing";

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
			<div className="grid grid-cols-2 gap-4">
				<FormField
					control={form.control}
					name="type"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tipo</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
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
		</>
	);
}
