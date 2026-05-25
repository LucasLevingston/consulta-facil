"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarClock, Clock, DollarSign, Plus, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import PageHeader from "@/components/custom/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useApplicationStatus } from "@/hooks/api/use-doctors";
import { useProfessionalPatients } from "@/hooks/api/use-patients";
import {
	useCancelProcedureRequest,
	useCreateProcedureRequest,
	useGetMyProcedureRequests,
	useScheduleProcedureRequest,
} from "@/hooks/api/use-procedure-requests";
import { useGetProfessionalServices } from "@/hooks/api/use-services";
import {
	type CreateProcedureRequestInput,
	createProcedureRequestSchema,
	type ProcedureRequest,
	type ProcedureRequestStatus,
	type ScheduleProcedureRequestInput,
	scheduleProcedureRequestSchema,
} from "@/lib/schemas/procedure-request.schema";
import { QueryBoundary } from "@/providers/query-boundary";
import { useUserStore } from "@/store/useUserStore";

const STATUS_LABELS: Record<ProcedureRequestStatus, string> = {
	PENDING: "Pendente",
	SCHEDULED: "Agendado",
	COMPLETED: "Concluído",
	CANCELED: "Cancelado",
};

const STATUS_VARIANTS: Record<
	ProcedureRequestStatus,
	"default" | "secondary" | "destructive" | "outline"
> = {
	PENDING: "default",
	SCHEDULED: "secondary",
	COMPLETED: "outline",
	CANCELED: "destructive",
};

function StatusBadge({ status }: { status: ProcedureRequestStatus }) {
	return (
		<Badge variant={STATUS_VARIANTS[status]}>{STATUS_LABELS[status]}</Badge>
	);
}

export default function ProcedureRequestsPage() {
	const { user } = useUserStore();
	const role = user?.role ?? "PATIENT";
	const isProfessional = role === "PROFESSIONAL" || role === "ADMIN";

	return (
		<div className="space-y-6">
			<PageHeader
				title="Solicitações de Procedimento"
				description={
					isProfessional
						? "Gerencie solicitações de procedimentos para seus pacientes."
						: "Veja e agende os procedimentos solicitados pelo seu profissional."
				}
				icon={<CalendarClock className="h-6 w-6" />}
			/>
			<ProcedureRequestsContent isProfessional={isProfessional} />
		</div>
	);
}

function ProcedureRequestsContent({
	isProfessional,
}: {
	isProfessional: boolean;
}) {
	const { data: requests = [], isLoading, error } = useGetMyProcedureRequests();
	const profileQuery = useApplicationStatus();

	if (isProfessional) {
		return (
			<QueryBoundary
				isLoading={isLoading || profileQuery.isLoading}
				error={error ?? profileQuery.error}
			>
				<ProfessionalView
					requests={requests}
					professionalId={profileQuery.data?.id ?? ""}
				/>
			</QueryBoundary>
		);
	}

	return (
		<QueryBoundary isLoading={isLoading} error={error}>
			<PatientView requests={requests} />
		</QueryBoundary>
	);
}

function ProfessionalView({
	requests,
	professionalId,
}: {
	requests: ProcedureRequest[];
	professionalId: string;
}) {
	const [open, setOpen] = useState(false);

	return (
		<div className="space-y-4 max-w-3xl">
			<div className="flex justify-end">
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button size="sm">
							<Plus className="h-4 w-4 mr-1" />
							Nova solicitação
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Nova solicitação de procedimento</DialogTitle>
						</DialogHeader>
						<CreateProcedureRequestForm
							professionalId={professionalId}
							onClose={() => setOpen(false)}
						/>
					</DialogContent>
				</Dialog>
			</div>

			{requests.length === 0 ? (
				<Card>
					<CardContent className="py-12 text-center text-sm text-muted-foreground">
						Nenhuma solicitação criada ainda.
					</CardContent>
				</Card>
			) : (
				<div className="space-y-3">
					{requests.map((req) => (
						<ProfessionalRequestCard key={req.id} request={req} />
					))}
				</div>
			)}
		</div>
	);
}

function PatientView({ requests }: { requests: ProcedureRequest[] }) {
	if (requests.length === 0) {
		return (
			<Card className="max-w-3xl">
				<CardContent className="py-12 text-center text-sm text-muted-foreground">
					Nenhuma solicitação de procedimento para você.
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-3 max-w-3xl">
			{requests.map((req) => (
				<PatientRequestCard key={req.id} request={req} />
			))}
		</div>
	);
}

function ProfessionalRequestCard({ request }: { request: ProcedureRequest }) {
	const { mutateAsync: cancel, isPending } = useCancelProcedureRequest();

	async function handleCancel() {
		try {
			await cancel(request.id);
			toast.success("Solicitação cancelada.");
		} catch {
			toast.error("Erro ao cancelar solicitação.");
		}
	}

	const canCancel =
		request.status === "PENDING" || request.status === "SCHEDULED";

	return (
		<Card>
			<CardHeader className="pb-2">
				<div className="flex items-start justify-between gap-2">
					<div>
						<CardTitle className="text-sm font-medium">
							{request.serviceName}
						</CardTitle>
						<CardDescription>
							Paciente: {request.patientName ?? request.patientId}
						</CardDescription>
					</div>
					<StatusBadge status={request.status} />
				</div>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="flex items-center gap-4 text-xs text-muted-foreground">
					<span className="flex items-center gap-1">
						<DollarSign className="h-3 w-3" />
						R$ {request.servicePrice.toFixed(2)}
					</span>
					<span className="flex items-center gap-1">
						<Clock className="h-3 w-3" />
						{request.serviceDurationMinutes} min
					</span>
				</div>
				{request.notes && (
					<p className="text-xs text-muted-foreground">{request.notes}</p>
				)}
				{canCancel && (
					<div className="flex justify-end">
						<Button
							variant="ghost"
							size="sm"
							className="text-destructive h-8"
							onClick={handleCancel}
							disabled={isPending}
						>
							<X className="h-3 w-3 mr-1" />
							Cancelar
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

function PatientRequestCard({ request }: { request: ProcedureRequest }) {
	const { mutateAsync: cancel, isPending: canceling } =
		useCancelProcedureRequest();
	const [scheduleOpen, setScheduleOpen] = useState(false);

	async function handleCancel() {
		try {
			await cancel(request.id);
			toast.success("Solicitação cancelada.");
		} catch {
			toast.error("Erro ao cancelar solicitação.");
		}
	}

	const canCancel =
		request.status === "PENDING" || request.status === "SCHEDULED";
	const canSchedule = request.status === "PENDING";

	return (
		<Card>
			<CardHeader className="pb-2">
				<div className="flex items-start justify-between gap-2">
					<div>
						<CardTitle className="text-sm font-medium">
							{request.serviceName}
						</CardTitle>
						<CardDescription>
							Profissional: {request.professionalName ?? request.professionalId}
						</CardDescription>
					</div>
					<StatusBadge status={request.status} />
				</div>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="flex items-center gap-4 text-xs text-muted-foreground">
					<span className="flex items-center gap-1">
						<DollarSign className="h-3 w-3" />
						R$ {request.servicePrice.toFixed(2)}
					</span>
					<span className="flex items-center gap-1">
						<Clock className="h-3 w-3" />
						{request.serviceDurationMinutes} min
					</span>
				</div>
				{request.notes && (
					<p className="text-xs text-muted-foreground">{request.notes}</p>
				)}
				{(canSchedule || canCancel) && (
					<div className="flex gap-2 justify-end">
						{canSchedule && (
							<Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
								<DialogTrigger asChild>
									<Button size="sm" className="h-8">
										<CalendarClock className="h-3 w-3 mr-1" />
										Agendar
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Agendar procedimento</DialogTitle>
									</DialogHeader>
									<ScheduleProcedureRequestForm
										requestId={request.id}
										serviceName={request.serviceName}
										onClose={() => setScheduleOpen(false)}
									/>
								</DialogContent>
							</Dialog>
						)}
						{canCancel && (
							<Button
								variant="ghost"
								size="sm"
								className="text-destructive h-8"
								onClick={handleCancel}
								disabled={canceling}
							>
								<X className="h-3 w-3 mr-1" />
								Cancelar
							</Button>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

function CreateProcedureRequestForm({
	professionalId,
	onClose,
}: {
	professionalId: string;
	onClose: () => void;
}) {
	const { data: services = [] } = useGetProfessionalServices(professionalId);
	const { data: patientsPage } = useProfessionalPatients(professionalId, {
		size: 100,
	});
	const patients = patientsPage?.content ?? [];
	const requiresConsultationServices = services.filter(
		(s) => s.requiresConsultation,
	);

	const { mutateAsync: create, isPending } = useCreateProcedureRequest();

	const form = useForm<CreateProcedureRequestInput>({
		resolver: zodResolver(createProcedureRequestSchema),
		defaultValues: { serviceId: "", patientId: "", notes: "" },
	});

	async function onSubmit(values: CreateProcedureRequestInput) {
		try {
			await create(values);
			toast.success("Solicitação criada!");
			onClose();
		} catch {
			toast.error("Erro ao criar solicitação.");
		}
	}

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
			<div className="space-y-1">
				<Label>Serviço *</Label>
				<Select
					onValueChange={(v) => form.setValue("serviceId", v)}
					value={form.watch("serviceId")}
				>
					<SelectTrigger>
						<SelectValue placeholder="Selecione um serviço" />
					</SelectTrigger>
					<SelectContent>
						{requiresConsultationServices.length === 0 && (
							<SelectItem value="_none" disabled>
								Nenhum serviço requer consulta prévia
							</SelectItem>
						)}
						{requiresConsultationServices.map((s) => (
							<SelectItem key={s.id} value={s.id}>
								{s.name} — R$ {s.price.toFixed(2)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{form.formState.errors.serviceId && (
					<p className="text-xs text-destructive">
						{form.formState.errors.serviceId.message}
					</p>
				)}
			</div>

			<div className="space-y-1">
				<Label>Paciente *</Label>
				{patients.length > 0 ? (
					<Select
						onValueChange={(v) => form.setValue("patientId", v)}
						value={form.watch("patientId")}
					>
						<SelectTrigger>
							<SelectValue placeholder="Selecione um paciente" />
						</SelectTrigger>
						<SelectContent>
							{patients.map((p) => (
								<SelectItem key={p.id} value={p.id}>
									{p.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				) : (
					<Input placeholder="ID do paciente" {...form.register("patientId")} />
				)}
				{form.formState.errors.patientId && (
					<p className="text-xs text-destructive">
						{form.formState.errors.patientId.message}
					</p>
				)}
			</div>

			<div className="space-y-1">
				<Label>Observações</Label>
				<Textarea
					placeholder="Instruções ou informações adicionais (opcional)"
					rows={3}
					{...form.register("notes")}
				/>
			</div>

			<div className="flex gap-2 pt-2">
				<Button type="submit" disabled={isPending} className="flex-1">
					{isPending ? "Criando..." : "Criar solicitação"}
				</Button>
				<Button type="button" variant="outline" onClick={onClose}>
					Cancelar
				</Button>
			</div>
		</form>
	);
}

function ScheduleProcedureRequestForm({
	requestId,
	serviceName,
	onClose,
}: {
	requestId: string;
	serviceName: string;
	onClose: () => void;
}) {
	const { mutateAsync: schedule, isPending } = useScheduleProcedureRequest();

	const form = useForm<ScheduleProcedureRequestInput>({
		resolver: zodResolver(scheduleProcedureRequestSchema),
		defaultValues: { scheduledAt: "", modality: undefined },
	});

	async function onSubmit(values: ScheduleProcedureRequestInput) {
		try {
			await schedule({ requestId, data: values });
			toast.success("Procedimento agendado!");
			onClose();
		} catch {
			toast.error("Erro ao agendar procedimento.");
		}
	}

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
			<p className="text-sm text-muted-foreground">
				Serviço:{" "}
				<span className="font-medium text-foreground">{serviceName}</span>
			</p>

			<div className="space-y-1">
				<Label htmlFor="scheduledAt">Data e hora *</Label>
				<Input
					id="scheduledAt"
					type="datetime-local"
					className="h-11"
					{...form.register("scheduledAt")}
					onChange={(e) => {
						const iso = e.target.value
							? new Date(e.target.value).toISOString()
							: "";
						form.setValue("scheduledAt", iso);
					}}
				/>
				{form.formState.errors.scheduledAt && (
					<p className="text-xs text-destructive">
						{form.formState.errors.scheduledAt.message}
					</p>
				)}
			</div>

			<div className="space-y-1">
				<Label>Modalidade</Label>
				<Select
					onValueChange={(v) =>
						form.setValue("modality", v as "IN_PERSON" | "ONLINE")
					}
					value={form.watch("modality") ?? ""}
				>
					<SelectTrigger>
						<SelectValue placeholder="Selecione (opcional)" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="IN_PERSON">Presencial</SelectItem>
						<SelectItem value="ONLINE">Online</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="flex gap-2 pt-2">
				<Button type="submit" disabled={isPending} className="flex-1">
					{isPending ? "Agendando..." : "Confirmar agendamento"}
				</Button>
				<Button type="button" variant="outline" onClick={onClose}>
					Cancelar
				</Button>
			</div>
		</form>
	);
}
