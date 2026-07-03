"use client";

import { useState } from "react";

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandList,
} from "@/components/ui/command";
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ProfessionalComboboxTrigger } from "./ProfessionalComboboxTrigger";
import type { ProfessionalFormFieldProps } from "./ProfessionalFormField.types";
import { ProfessionalOption } from "./ProfessionalOption";

export function ProfessionalFormField({
	control,
	professionals,
	professionalsLoading,
	professionalIdParam,
	selectedProfessional,
	onProfessionalSelect,
}: ProfessionalFormFieldProps) {
	const [open, setOpen] = useState(false);

	return (
		<FormField
			control={control}
			name="professionalId"
			render={({ field }) => (
				<FormItem>
					<FormControl>
						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger asChild>
								<ProfessionalComboboxTrigger
									selected={selectedProfessional}
									open={open}
									disabled={professionalsLoading || !!professionalIdParam}
									hasValue={!!field.value}
								/>
							</PopoverTrigger>
							<PopoverContent className="w-full p-0 rounded-xl" align="start">
								<Command>
									<CommandInput placeholder="Pesquisar por nome ou especialidade..." />
									<CommandList>
										<CommandEmpty>
											{professionalsLoading
												? "Carregando..."
												: "Nenhum profissional encontrado."}
										</CommandEmpty>
										<CommandGroup>
											{professionals
												.filter((d) => d.name)
												.map((professional) => (
													<ProfessionalOption
														key={professional.id}
														professional={professional}
														isSelected={field.value === professional.id}
														onSelect={() => {
															field.onChange(professional.id);
															setOpen(false);
															onProfessionalSelect();
														}}
													/>
												))}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
