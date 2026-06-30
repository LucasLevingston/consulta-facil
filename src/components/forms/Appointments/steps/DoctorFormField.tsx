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
import { DoctorComboboxTrigger } from "./DoctorComboboxTrigger";
import type { DoctorFormFieldProps } from "./DoctorFormField.types";
import { DoctorOption } from "./DoctorOption";

export function DoctorFormField({
	control,
	professionals,
	professionalsLoading,
	professionalIdParam,
	selectedProfessional,
	onDoctorSelect,
}: DoctorFormFieldProps) {
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
								<DoctorComboboxTrigger
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
												.map((doctor) => (
													<DoctorOption
														key={doctor.id}
														doctor={doctor}
														isSelected={field.value === doctor.id}
														onSelect={() => {
															field.onChange(doctor.id);
															setOpen(false);
															onDoctorSelect();
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
