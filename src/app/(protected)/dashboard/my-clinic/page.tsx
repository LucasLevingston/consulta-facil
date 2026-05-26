"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Trash2, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import CustomFormField, {
	FormFieldType,
} from "@/components/custom/forms-components/custom-form-field";
import { CustomSubmitButton } from "@/components/custom/forms-components/custom-submit-button";
import { LocationPicker } from "@/components/custom/map/LocationPicker";
import PageHeader from "@/components/custom/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	useClinicReceptionists,
	useCreateClinic,
	useInviteReceptionist,
	useMyClinic,
	useRemoveReceptionist,
	useUpdateClinic,
} from "@/hooks/api/use-clinics";
import {
	useClinicWorkingHours,
	useSaveClinicWorkingHours,
} from "@/hooks/api/use-schedule";
import {
	type ClinicResponse,
	type CreateClinicInput,
	createClinicSchema,
	type InviteReceptionistInput,
	inviteReceptionistSchema,
} from "@/lib/schemas/clinic.schema";
import {
	type ClinicWorkingHoursItem,
	type ClinicWorkingHoursResponse,
	DAY_LABELS,
	DAYS_OF_WEEK,
	type DayOfWeek,
} from "@/lib/schemas/schedule.schema";
import { QueryBoundary } from "@/providers/query-boundary";

export default function MyClinicPage() {
	return (
		<div className="space-y-6">
			<PageHeader
				title="Minha Clínica"
				description="Crie e gerencie as informações da sua clínica."
				icon={<Building2 className="h-6 w-6" />}
			/>
			<MyClinicContent />
		</div>
	);
}

function MyClinicContent() {
	const { data: clinics = [], isLoading, error } = useMyClinic();
	const existing = clinics[0];

	return (
		<QueryBoundary isLoading={isLoading} error={error}>
			<div className="space-y-10">
				<ClinicForm clinic={existing} />
				{existing && <ClinicWorkingHoursSection clinicId={existing.id} />}
				{existing && <ReceptionistsSection clinicId={existing.id} />}
			</div>
		</QueryBoundary>
	);
}

function ClinicForm({ clinic }: { clinic?: ClinicResponse }) {
	const isEdit = !!clinic;
	const [lat, setLat] = useState<number | null>(clinic?.latitude ?? null);
	const [lng, setLng] = useState<number | null>(clinic?.longitude ?? null);

	const { mutateAsync: createClinic } = useCreateClinic();
	const { mutateAsync: updateClinic } = useUpdateClinic();

	const form = useForm<CreateClinicInput>({
		resolver: zodResolver(createClinicSchema),
		defaultValues: isEdit
			? {
					name: clinic.name,
					description: clinic.description ?? "",
					phone: clinic.phone ?? "",
					address: clinic.address ?? "",
					city: clinic.city ?? "",
					state: clinic.state ?? "",
					zipCode: clinic.zipCode ?? "",
					latitude: clinic.latitude ?? undefined,
					longitude: clinic.longitude ?? undefined,
				}
			: {
					name: "",
					description: "",
					phone: "",
					address: "",
					city: "",
					state: "",
					zipCode: "",
				},
	});

	function handleLocationSelect(selectedLat: number, selectedLng: number) {
		setLat(selectedLat);
		setLng(selectedLng);
		form.setValue("latitude", selectedLat);
		form.setValue("longitude", selectedLng);
	}

	async function onSubmit(values: CreateClinicInput) {
		try {
			if (isEdit) {
				await updateClinic({ id: clinic.id, data: values });
				toast.success("Clínica atualizada com sucesso!");
			} else {
				await createClinic(values);
				toast.success("Clínica criada com sucesso!");
			}
		} catch {
			toast.error("Erro ao salvar clínica.");
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-6 max-w-2xl"
			>
				<div className="space-y-4">
					<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
						Informações básicas
					</h3>
					<CustomFormField
						form={form}
						name="name"
						fieldType={FormFieldType.INPUT}
					/>
					<CustomFormField
						form={form}
						name="description"
						fieldType={FormFieldType.TEXTAREA}
					/>
					<CustomFormField
						form={form}
						name="phone"
						fieldType={FormFieldType.INPUT}
					/>
				</div>

				<div className="space-y-4">
					<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
						Endereço
					</h3>
					<div className="grid grid-cols-2 gap-4">
						<CustomFormField
							form={form}
							name="address"
							fieldType={FormFieldType.INPUT}
						/>
						<CustomFormField
							form={form}
							name="zipCode"
							fieldType={FormFieldType.INPUT}
							label="CEP"
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<CustomFormField
							form={form}
							name="city"
							fieldType={FormFieldType.INPUT}
							label="Cidade"
						/>
						<CustomFormField
							form={form}
							name="state"
							fieldType={FormFieldType.INPUT}
							label="Estado"
						/>
					</div>
				</div>

				<div className="space-y-4">
					<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
						Localização no mapa
					</h3>
					<LocationPicker
						lat={lat}
						lng={lng}
						onLocationSelect={handleLocationSelect}
					/>
				</div>

				<CustomSubmitButton form={form} isDirty={form.formState.isDirty}>
					{isEdit ? "Salvar alterações" : "Criar clínica"}
				</CustomSubmitButton>
			</form>
		</Form>
	);
}

function ClinicWorkingHoursSection({ clinicId }: { clinicId: string }) {
	const {
		data: savedHours = [],
		isLoading,
		error,
	} = useClinicWorkingHours(clinicId);

	return (
		<div className="max-w-2xl space-y-4">
			<div>
				<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
					Horários de funcionamento
				</h3>
				<p className="text-xs text-muted-foreground mt-1">
					Configure os dias e horários em que a clínica está aberta.
				</p>
			</div>
			<QueryBoundary isLoading={isLoading} error={error}>
				<ClinicHoursEditor clinicId={clinicId} savedHours={savedHours} />
			</QueryBoundary>
		</div>
	);
}

function buildDefaultHoursRow(
	day: DayOfWeek,
	saved?: ClinicWorkingHoursResponse,
): ClinicWorkingHoursItem {
	if (saved) {
		return {
			dayOfWeek: day,
			openTime: saved.openTime,
			closeTime: saved.closeTime,
			isOpen: saved.isOpen,
		};
	}
	const isWeekend = day === "SATURDAY" || day === "SUNDAY";
	return {
		dayOfWeek: day,
		openTime: "08:00",
		closeTime: "18:00",
		isOpen: !isWeekend,
	};
}

function ClinicHoursEditor({
	clinicId,
	savedHours,
}: {
	clinicId: string;
	savedHours: ClinicWorkingHoursResponse[];
}) {
	const [rows, setRows] = useState<ClinicWorkingHoursItem[]>(() =>
		DAYS_OF_WEEK.map((day) => {
			const saved = savedHours.find((h) => h.dayOfWeek === day);
			return buildDefaultHoursRow(day, saved);
		}),
	);

	useEffect(() => {
		if (savedHours.length > 0) {
			setRows(
				DAYS_OF_WEEK.map((day) => {
					const saved = savedHours.find((h) => h.dayOfWeek === day);
					return buildDefaultHoursRow(day, saved);
				}),
			);
		}
	}, [savedHours]);

	const { mutateAsync: saveHours, isPending } =
		useSaveClinicWorkingHours(clinicId);

	function updateRow(day: DayOfWeek, patch: Partial<ClinicWorkingHoursItem>) {
		setRows((prev) =>
			prev.map((r) => (r.dayOfWeek === day ? { ...r, ...patch } : r)),
		);
	}

	async function handleSave() {
		try {
			await saveHours(rows);
			toast.success("Horários salvos com sucesso!");
		} catch {
			toast.error("Erro ao salvar horários.");
		}
	}

	return (
		<div className="space-y-3">
			{rows.map((row) => (
				<Card key={row.dayOfWeek} className={row.isOpen ? "" : "opacity-60"}>
					<CardContent className="pt-4 pb-4">
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
							<div className="flex items-center gap-3 sm:w-36">
								<Switch
									checked={row.isOpen}
									onCheckedChange={(checked) =>
										updateRow(row.dayOfWeek, { isOpen: checked })
									}
								/>
								<span className="text-sm font-medium w-16">
									{DAY_LABELS[row.dayOfWeek]}
								</span>
								{row.isOpen ? (
									<Badge
										variant="default"
										className="text-xs hidden sm:inline-flex"
									>
										Aberto
									</Badge>
								) : (
									<Badge
										variant="secondary"
										className="text-xs hidden sm:inline-flex"
									>
										Fechado
									</Badge>
								)}
							</div>

							<div className="flex items-center gap-3 flex-1">
								<div className="flex items-center gap-2">
									<Label className="text-xs text-muted-foreground shrink-0">
										Abre
									</Label>
									<Input
										type="time"
										value={row.openTime}
										disabled={!row.isOpen}
										onChange={(e) =>
											updateRow(row.dayOfWeek, { openTime: e.target.value })
										}
										className="h-9 w-28 rounded-lg border-border bg-bg-input text-sm"
									/>
								</div>
								<div className="flex items-center gap-2">
									<Label className="text-xs text-muted-foreground shrink-0">
										Fecha
									</Label>
									<Input
										type="time"
										value={row.closeTime}
										disabled={!row.isOpen}
										onChange={(e) =>
											updateRow(row.dayOfWeek, { closeTime: e.target.value })
										}
										className="h-9 w-28 rounded-lg border-border bg-bg-input text-sm"
									/>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			))}

			<Button
				onClick={handleSave}
				disabled={isPending}
				className="w-full sm:w-auto"
			>
				{isPending ? "Salvando..." : "Salvar horários"}
			</Button>
		</div>
	);
}

function ReceptionistsSection({ clinicId }: { clinicId: string }) {
	const { data: receptionists = [], isLoading } =
		useClinicReceptionists(clinicId);
	const { mutateAsync: invite } = useInviteReceptionist(clinicId);
	const { mutateAsync: remove } = useRemoveReceptionist(clinicId);
	const [open, setOpen] = useState(false);

	const form = useForm<InviteReceptionistInput>({
		resolver: zodResolver(inviteReceptionistSchema),
		defaultValues: { email: "" },
	});

	async function onSubmit(values: InviteReceptionistInput) {
		try {
			await invite(values);
			toast.success("Recepcionista adicionado!");
			form.reset();
			setOpen(false);
		} catch {
			toast.error("Erro ao adicionar recepcionista.");
		}
	}

	async function handleRemove(receptionistId: string) {
		try {
			await remove(receptionistId);
			toast.success("Recepcionista removido.");
		} catch {
			toast.error("Erro ao remover recepcionista.");
		}
	}

	if (isLoading) return null;

	return (
		<div className="max-w-2xl space-y-4">
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
						Recepcionistas
					</h3>
					<p className="text-xs text-muted-foreground mt-1">
						Usuários com acesso à recepção desta clínica.
					</p>
				</div>
				{!open && (
					<Button
						size="sm"
						variant="outline"
						className="gap-2"
						onClick={() => setOpen(true)}
					>
						<UserPlus className="h-3.5 w-3.5" />
						Adicionar
					</Button>
				)}
			</div>

			{open && (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex gap-2 items-end"
					>
						<div className="flex-1">
							<CustomFormField
								form={form}
								name="email"
								fieldType={FormFieldType.EMAIL}
								label="E-mail do usuário"
								placeholder="usuario@email.com"
							/>
						</div>
						<CustomSubmitButton form={form} submittingText="Adicionando...">
							Adicionar
						</CustomSubmitButton>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => setOpen(false)}
						>
							Cancelar
						</Button>
					</form>
				</Form>
			)}

			{receptionists.length === 0 ? (
				<p className="text-sm text-muted-foreground">
					Nenhum recepcionista cadastrado.
				</p>
			) : (
				<div className="space-y-2">
					{receptionists.map((r) => (
						<Card key={r.id}>
							<CardContent className="py-3 flex items-center justify-between">
								<div>
									<p className="text-sm font-medium">{r.name}</p>
									<p className="text-xs text-muted-foreground">{r.email}</p>
								</div>
								<Button
									size="icon"
									variant="ghost"
									className="text-destructive hover:text-destructive"
									onClick={() => handleRemove(r.id)}
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
