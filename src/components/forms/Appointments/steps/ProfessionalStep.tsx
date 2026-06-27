"use client";

import { Check, ChevronsUpDown, Search, Stethoscope, X } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
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
import { cn } from "@/lib/utils/cn";
import { SPECIALTY_LABELS } from "@/utils/constants/profession-specialties";
import type { ProfessionalStepProps } from "./ProfessionalStep.types";

function getInitials(name: string | null | undefined): string {
	return (
		name
			?.split(" ")
			.map((n) => n[0])
			.join("")
			.slice(0, 2)
			.toUpperCase() ?? "?"
	);
}

export function ProfessionalStep({
	control,
	professionals,
	professionalsLoading,
	professionalIdParam,
	selectedProfessional,
	initialSpecialtyFilter = "",
	onDoctorSelect,
	onDoctorClear,
}: ProfessionalStepProps) {
	const [open, setOpen] = useState(false);
	const [specialtyFilter] = useState(initialSpecialtyFilter);

	const filteredDoctors = specialtyFilter
		? professionals.filter((d) =>
				d.specialty?.toLowerCase().includes(specialtyFilter.toLowerCase()),
			)
		: professionals;

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2">
				<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
					1
				</div>
				<h3 className="font-semibold text-foreground">
					Escolha o profissional
				</h3>
			</div>

			<FormField
				control={control}
				name="professionalId"
				render={({ field }) => (
					<FormItem>
						<FormControl>
							<Popover open={open} onOpenChange={setOpen}>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										role="combobox"
										aria-expanded={open}
										disabled={professionalsLoading || !!professionalIdParam}
										className={cn(
											"w-full justify-between rounded-xl border-border h-auto py-3 px-4",
											!field.value && "text-muted-foreground",
										)}
									>
										{selectedProfessional ? (
											<div className="flex items-center gap-3">
												<Avatar className="h-8 w-8 rounded-lg">
													<AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-bold">
														{getInitials(selectedProfessional.name)}
													</AvatarFallback>
												</Avatar>
												<div className="text-left">
													<p className="text-sm font-medium">
														{selectedProfessional.name}
													</p>
													<p className="text-xs text-muted-foreground">
														{SPECIALTY_LABELS[selectedProfessional.specialty] ??
															selectedProfessional.specialty}
													</p>
												</div>
											</div>
										) : (
											<div className="flex items-center gap-2">
												<Search className="h-4 w-4" />
												<span>Buscar profissional...</span>
											</div>
										)}
										<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
									</Button>
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
												{filteredDoctors
													.filter((d) => d.name)
													.map((doctor) => (
														<CommandItem
															key={doctor.id}
															value={`${doctor.name} ${doctor.specialty}`}
															onSelect={() => {
																field.onChange(doctor.id);
																setOpen(false);
																onDoctorSelect();
															}}
														>
															<div className="flex items-center gap-3 flex-1">
																<Avatar className="h-8 w-8 rounded-lg">
																	<AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-bold">
																		{getInitials(doctor.name)}
																	</AvatarFallback>
																</Avatar>
																<div>
																	<p className="text-sm font-medium">
																		{doctor.name}
																	</p>
																	<p className="text-xs text-muted-foreground">
																		{SPECIALTY_LABELS[doctor.specialty] ??
																			doctor.specialty}
																	</p>
																</div>
															</div>
															<Check
																className={cn(
																	"ml-auto h-4 w-4",
																	field.value === doctor.id
																		? "opacity-100"
																		: "opacity-0",
																)}
															/>
														</CommandItem>
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

			{selectedProfessional && (
				<div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
					<Stethoscope className="h-4 w-4 text-primary shrink-0" />
					<div className="flex-1 min-w-0">
						<p className="text-sm font-medium">{selectedProfessional.name}</p>
						<p className="text-xs text-muted-foreground">
							{SPECIALTY_LABELS[selectedProfessional.specialty] ??
								selectedProfessional.specialty}
						</p>
					</div>
					{!professionalIdParam && (
						<button
							type="button"
							onClick={onDoctorClear}
							className="text-muted-foreground hover:text-foreground transition-colors"
						>
							<X className="h-4 w-4" />
						</button>
					)}
				</div>
			)}
		</div>
	);
}
