"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, setHours, setMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
	CalendarIcon,
	Check,
	ChevronsUpDown,
	Clock,
	FileText,
	Search,
	Stethoscope,
	X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
	useCancelAppointment,
	useScheduleAppointment,
} from "@/hooks/api/use-appointments";
import { useProfessionals } from "@/hooks/api/use-doctors";
import {
	type AppointmentFormValues,
	type AppointmentResponse,
	appointmentFormSchema,
} from "@/lib/schemas/appointment.schema";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/useUserStore";

const TIME_SLOTS = [
	{ label: "08:00", hours: 8, minutes: 0 },
	{ label: "09:00", hours: 9, minutes: 0 },
	{ label: "10:00", hours: 10, minutes: 0 },
	{ label: "11:00", hours: 11, minutes: 0 },
	{ label: "13:00", hours: 13, minutes: 0 },
	{ label: "14:00", hours: 14, minutes: 0 },
	{ label: "15:00", hours: 15, minutes: 0 },
	{ label: "16:00", hours: 16, minutes: 0 },
	{ label: "17:00", hours: 17, minutes: 0 },
];

export const AppointmentForm = ({
	type = "create",
	appointment,
	setOpen,
}: {
	type: "create" | "schedule" | "cancel";
	appointment?: AppointmentResponse;
	setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const professionalIdParam =
		searchParams.get("professionalid") ?? searchParams.get("doctorid");
	const { user: authUser } = useUserStore();

	const { data: doctorsPage, isLoading: doctorsLoading } = useProfessionals(
		0,
		100,
	);
	const doctors = doctorsPage?.content ?? [];

	const scheduleAppointment = useScheduleAppointment();
	const cancelAppointment = useCancelAppointment();

	const [professionalOpen, setProfessionalOpen] = useState(false);
	const [selectedTime, setSelectedTime] = useState<string>("");

	const form = useForm<AppointmentFormValues>({
		resolver: zodResolver(appointmentFormSchema),
		defaultValues: {
			professionalId: appointment?.professionalId ?? professionalIdParam ?? "",
			scheduledAt: appointment ? new Date(appointment.scheduledAt) : undefined,
			reason: appointment?.reason ?? "",
			notes: appointment?.notes ?? "",
			cancellationReason: "",
			userId: authUser?.id ?? "",
		},
	});

	const selectedProfessionalId = form.watch("professionalId");
	const selectedDate = form.watch("scheduledAt");
	const selectedDoctor = doctors.find(
		(d) =>
			d.id === selectedProfessionalId || d.userId === selectedProfessionalId,
	);

	const handleTimeSelect = (slot: (typeof TIME_SLOTS)[number]) => {
		setSelectedTime(slot.label);
		if (selectedDate) {
			const newDate = setMinutes(
				setHours(selectedDate, slot.hours),
				slot.minutes,
			);
			form.setValue("scheduledAt", newDate);
		} else {
			const base = new Date();
			const newDate = setMinutes(setHours(base, slot.hours), slot.minutes);
			form.setValue("scheduledAt", newDate);
		}
	};

	const onSubmit = async (values: AppointmentFormValues) => {
		try {
			if (type === "create" || type === "schedule") {
				const created = await scheduleAppointment.mutateAsync({
					professionalId: selectedDoctor?.id ?? values.professionalId,
					scheduledAt: (values.scheduledAt as Date).toISOString(),
					reason: values.reason ?? undefined,
					notes: values.notes ?? undefined,
				});
				if (type === "create") {
					form.reset();
					router.push(`/dashboard/appointments/${created.id}`);
				} else {
					setOpen?.(false);
					form.reset();
				}
			} else if (type === "cancel") {
				if (!appointment) return;
				await cancelAppointment.mutateAsync({
					id: appointment.id,
					data: { cancellationReason: values.cancellationReason ?? "" },
				});
				setOpen?.(false);
				form.reset();
			}
		} catch (error: unknown) {
			toast.error(
				(error instanceof Error ? error.message : null) ??
					"Erro ao processar consulta.",
			);
		}
	};

	const isPending =
		scheduleAppointment.isPending || cancelAppointment.isPending;

	if (type === "cancel") {
		return (
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="cancellationReason"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-semibold text-primary">
									Motivo do cancelamento
								</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Descreva o motivo do cancelamento..."
										className="min-h-[120px] resize-none rounded-xl border-border"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						type="submit"
						variant="destructive"
						className="w-full rounded-xl"
						disabled={isPending}
					>
						{isPending ? "Cancelando..." : "Cancelar Consulta"}
					</Button>
				</form>
			</Form>
		);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				{/* Step 1 — Doctor */}
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
						control={form.control}
						name="professionalId"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Popover
										open={professionalOpen}
										onOpenChange={setProfessionalOpen}
									>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												role="combobox"
												aria-expanded={professionalOpen}
												disabled={doctorsLoading || !!professionalIdParam}
												className={cn(
													"w-full justify-between rounded-xl border-border h-auto py-3 px-4",
													!field.value && "text-muted-foreground",
												)}
											>
												{selectedDoctor ? (
													<div className="flex items-center gap-3">
														<Avatar className="h-8 w-8 rounded-lg">
															<AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-bold">
																{selectedDoctor.name
																	?.split(" ")
																	.map((n) => n[0])
																	.join("")
																	.slice(0, 2)
																	.toUpperCase() ?? "?"}
															</AvatarFallback>
														</Avatar>
														<div className="text-left">
															<p className="text-sm font-medium">
																{selectedDoctor.name}
															</p>
															<p className="text-xs text-muted-foreground">
																{selectedDoctor.specialty}
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
										<PopoverContent
											className="w-full p-0 rounded-xl"
											align="start"
										>
											<Command>
												<CommandInput placeholder="Pesquisar por nome ou especialidade..." />
												<CommandList>
													<CommandEmpty>
														{doctorsLoading
															? "Carregando..."
															: "Nenhum profissional encontrado."}
													</CommandEmpty>
													<CommandGroup>
														{doctors
															.filter((d) => d.name)
															.map((doctor) => (
																<CommandItem
																	key={doctor.id}
																	value={`${doctor.name} ${doctor.specialty}`}
																	onSelect={() => {
																		field.onChange(doctor.id);
																		setProfessionalOpen(false);
																	}}
																>
																	<div className="flex items-center gap-3 flex-1">
																		<Avatar className="h-8 w-8 rounded-lg">
																			<AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-bold">
																				{doctor.name
																					?.split(" ")
																					.map((n) => n[0])
																					.join("")
																					.slice(0, 2)
																					.toUpperCase() ?? "?"}
																			</AvatarFallback>
																		</Avatar>
																		<div>
																			<p className="text-sm font-medium">
																				{doctor.name}
																			</p>
																			<p className="text-xs text-muted-foreground">
																				{doctor.specialty}
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

					{selectedDoctor && (
						<div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
							<Stethoscope className="h-4 w-4 text-primary shrink-0" />
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium">{selectedDoctor.name}</p>
								<p className="text-xs text-muted-foreground">
									{selectedDoctor.specialty}
								</p>
							</div>
							{!professionalIdParam && (
								<button
									type="button"
									onClick={() => form.setValue("professionalId", "")}
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									<X className="h-4 w-4" />
								</button>
							)}
						</div>
					)}
				</div>

				{/* Step 2 — Date & Time */}
				<div className="space-y-3">
					<div className="flex items-center gap-2">
						<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
							2
						</div>
						<h3 className="font-semibold text-foreground">Data e horário</h3>
					</div>

					<FormField
						control={form.control}
						name="scheduledAt"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												type="button"
												variant="outline"
												className={cn(
													"w-full justify-start rounded-xl border-border h-11 px-4",
													!field.value && "text-muted-foreground",
												)}
											>
												<CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
												{field.value
													? format(field.value, "EEEE, d 'de' MMMM 'de' yyyy", {
															locale: ptBR,
														})
													: "Selecione uma data"}
											</Button>
										</PopoverTrigger>
										<PopoverContent
											className="w-auto p-0 rounded-2xl"
											align="start"
										>
											<Calendar
												mode="single"
												selected={field.value}
												onSelect={(date) => {
													if (!date) return;
													if (selectedTime) {
														const slot = TIME_SLOTS.find(
															(s) => s.label === selectedTime,
														);
														if (slot) {
															field.onChange(
																setMinutes(
																	setHours(date, slot.hours),
																	slot.minutes,
																),
															);
															return;
														}
													}
													field.onChange(date);
												}}
												disabled={(date) =>
													date < new Date(new Date().setHours(0, 0, 0, 0))
												}
												locale={ptBR}
											/>
										</PopoverContent>
									</Popover>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="space-y-2">
						<p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
							<Clock className="h-3.5 w-3.5" />
							Horário disponível
						</p>
						<div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
							{TIME_SLOTS.map((slot) => (
								<button
									key={slot.label}
									type="button"
									onClick={() => handleTimeSelect(slot)}
									className={cn(
										"rounded-xl border py-2.5 text-sm font-medium transition-all duration-150",
										selectedTime === slot.label
											? "border-primary bg-primary text-primary-foreground shadow-sm"
											: "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground",
									)}
								>
									{slot.label}
								</button>
							))}
						</div>
					</div>

					{selectedDate && selectedTime && (
						<div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-2.5 text-sm">
							<Check className="h-4 w-4 text-green-500 shrink-0" />
							<span className="text-green-700 dark:text-green-400">
								{format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })} às{" "}
								{selectedTime}
							</span>
						</div>
					)}
				</div>

				{/* Step 3 — Details */}
				<div className="space-y-3">
					<div className="flex items-center gap-2">
						<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
							3
						</div>
						<h3 className="font-semibold text-foreground">Detalhes</h3>
						<Badge variant="secondary" className="text-xs">
							Opcional
						</Badge>
					</div>

					<FormField
						control={form.control}
						name="reason"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
									<FileText className="h-3.5 w-3.5" />
									Motivo da consulta
								</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Ex.: dor de cabeça frequente, check-up anual, retorno..."
										className="min-h-[100px] resize-none rounded-xl border-border focus-visible:ring-primary/30"
										maxLength={500}
										{...field}
										value={field.value ?? ""}
									/>
								</FormControl>
								<div className="flex justify-between items-center">
									<FormMessage />
									<span className="text-xs text-muted-foreground ml-auto">
										{(field.value ?? "").length}/500
									</span>
								</div>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="notes"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
									<FileText className="h-3.5 w-3.5" />
									Observações adicionais
								</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Informações relevantes, alergias, medicações em uso..."
										className="min-h-[90px] resize-none rounded-xl border-border focus-visible:ring-primary/30"
										{...field}
										value={field.value ?? ""}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<Button
					type="submit"
					className="w-full h-12 rounded-xl text-base font-semibold gap-2"
					disabled={isPending}
				>
					<Stethoscope className="h-5 w-5" />
					{isPending
						? "Agendando..."
						: type === "schedule"
							? "Agendar Consulta"
							: "Confirmar Agendamento"}
				</Button>
			</form>
		</Form>
	);
};
