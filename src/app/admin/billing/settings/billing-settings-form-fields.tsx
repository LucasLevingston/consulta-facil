import type { Control } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UpdateBillingSettingsValues } from "@/features/billing";

const NUMBER_FIELDS: Array<{
	name: keyof UpdateBillingSettingsValues;
	label: string;
}> = [
	{ name: "pixExpirationMinutes", label: "Expiração PIX (minutos)" },
	{ name: "invoiceExpirationDays", label: "Expiração de cobrança (dias)" },
	{ name: "defaultTrialDays", label: "Dias de trial padrão" },
];

export function BillingSettingsFormFields({
	control,
}: {
	control: Control<UpdateBillingSettingsValues>;
}) {
	return (
		<>
			<FormField
				control={control}
				name="defaultCurrency"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Moeda padrão</FormLabel>
						<FormControl>
							<Input {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={control}
				name="defaultGateway"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Gateway padrão</FormLabel>
						<FormControl>
							<Input {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			{NUMBER_FIELDS.map(({ name, label }) => (
				<FormField
					key={name}
					control={control}
					name={name}
					render={({ field }) => (
						<FormItem>
							<FormLabel>{label}</FormLabel>
							<FormControl>
								<Input
									type="number"
									{...field}
									onChange={(e) => field.onChange(Number(e.target.value))}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			))}
		</>
	);
}
