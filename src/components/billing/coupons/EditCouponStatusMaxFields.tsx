import type { Control } from "react-hook-form";
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
}

export function EditCouponStatusMaxFields({ control }: Props) {
	return (
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
	);
}
