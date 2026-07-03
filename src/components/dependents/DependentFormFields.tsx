"use client";

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
import { GENDER_LABELS } from "@/utils/constants/gender-labels";
import type { DependentFormFieldsProps } from "./DependentFormFields.types";
import { RelationshipField } from "./RelationshipField";

export function DependentFormFields({ control }: DependentFormFieldsProps) {
	return (
		<>
			<FormField
				control={control}
				name="name"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Nome *</FormLabel>
						<FormControl>
							<Input placeholder="Nome completo" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<RelationshipField control={control} />
			<FormField
				control={control}
				name="cpf"
				render={({ field }) => (
					<FormItem>
						<FormLabel>CPF (opcional)</FormLabel>
						<FormControl>
							<Input placeholder="000.000.000-00" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={control}
				name="birthDate"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Data de nascimento (opcional)</FormLabel>
						<FormControl>
							<Input type="date" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={control}
				name="gender"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Gênero (opcional)</FormLabel>
						<Select onValueChange={field.onChange} defaultValue={field.value}>
							<FormControl>
								<SelectTrigger>
									<SelectValue placeholder="Selecione" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								{Object.entries(GENDER_LABELS).map(([k, v]) => (
									<SelectItem key={k} value={k}>
										{v}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	);
}
