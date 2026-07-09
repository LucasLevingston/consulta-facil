import type { UseFormReturn } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { ProfessionalCertificateInput } from "@/features/professionals";

interface Props {
	form: UseFormReturn<ProfessionalCertificateInput>;
}

export function CertificateOptionalFields({ form }: Props) {
	return (
		<>
			<FormField
				control={form.control}
				name="issuingOrganization"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Instituição emissora</FormLabel>
						<FormControl>
							<Input
								placeholder="AHA, CFM..."
								{...field}
								value={field.value ?? ""}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="issueYear"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Ano de emissão</FormLabel>
						<FormControl>
							<Input
								type="number"
								placeholder="2021"
								value={field.value ?? ""}
								onChange={(e) =>
									field.onChange(
										e.target.value === "" ? null : Number(e.target.value),
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
				name="certificateUrl"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Link do certificado (opcional)</FormLabel>
						<FormControl>
							<Input
								placeholder="https://..."
								{...field}
								value={field.value ?? ""}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	);
}
