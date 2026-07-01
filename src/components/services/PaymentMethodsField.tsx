"use client";

import type { Control } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import type {
	PaymentMethod,
	UpdatePaymentSettingsInput,
} from "@/features/professionals";
import { PAYMENT_METHOD_LABELS } from "@/features/professionals";
import { ALL_METHODS } from "@/utils/constants/payment-methods";

interface Props {
	control: Control<UpdatePaymentSettingsInput>;
}

export function PaymentMethodsField({ control }: Props) {
	return (
		<FormField
			control={control}
			name="acceptedPaymentMethods"
			render={() => (
				<FormItem>
					<FormLabel className="text-sm font-medium">Métodos aceitos</FormLabel>
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
						{ALL_METHODS.map((method) => (
							<FormField
								key={method}
								control={control}
								name="acceptedPaymentMethods"
								render={({ field }) => {
									const checked = field.value.includes(method);
									return (
										<FormItem className="flex items-center gap-2 space-y-0 rounded-lg border border-border p-3">
											<FormControl>
												<Checkbox
													checked={checked}
													onCheckedChange={(val) => {
														const current = field.value as PaymentMethod[];
														field.onChange(
															val
																? [...current, method]
																: current.filter((m) => m !== method),
														);
													}}
												/>
											</FormControl>
											<FormLabel className="cursor-pointer text-sm font-normal">
												{PAYMENT_METHOD_LABELS[method]}
											</FormLabel>
										</FormItem>
									);
								}}
							/>
						))}
					</div>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
