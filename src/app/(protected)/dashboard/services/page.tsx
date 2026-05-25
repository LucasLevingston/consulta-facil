"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	Briefcase,
	Clock,
	DollarSign,
	Edit2,
	Plus,
	Trash2,
} from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApplicationStatus } from "@/hooks/api/use-doctors";
import {
	useCreateService,
	useDeactivateService,
	useGetProfessionalServices,
	useSetConsultationPrice,
	useUpdateService,
} from "@/hooks/api/use-services";
import {
	type CreateServiceInput,
	createServiceSchema,
	type ProfessionalService,
} from "@/lib/schemas/service.schema";
import { QueryBoundary } from "@/providers/query-boundary";
import { useUserStore } from "@/store/useUserStore";

export default function ServicesPage() {
	const { user } = useUserStore();

	if (user?.role !== "PROFESSIONAL" && user?.role !== "ADMIN") {
		return (
			<div className="space-y-6">
				<PageHeader
					title="Meus Serviços"
					description="Gerencie seus procedimentos e preços."
					icon={<Briefcase className="h-6 w-6" />}
				/>
				<p className="text-sm text-muted-foreground">
					Apenas profissionais podem gerenciar serviços.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<PageHeader
				title="Meus Serviços"
				description="Cadastre procedimentos com preço e duração. Pacientes poderão selecioná-los ao agendar."
				icon={<Briefcase className="h-6 w-6" />}
			/>
			<ServicesContent />
		</div>
	);
}

function ServicesContent() {
	const { data: profile, isLoading, error } = useApplicationStatus();
	const professionalId = profile?.id ?? "";

	return (
		<QueryBoundary isLoading={isLoading} error={error}>
			<div className="space-y-6 max-w-3xl">
				<ConsultationPriceCard
					consultationPrice={profile?.consultationPrice ?? null}
				/>
				<ServicesCard professionalId={professionalId} />
			</div>
		</QueryBoundary>
	);
}

function ConsultationPriceCard({
	consultationPrice,
}: {
	consultationPrice: number | null | undefined;
}) {
	const [price, setPrice] = useState(consultationPrice?.toString() ?? "");
	const { mutateAsync: setPrice_, isPending } = useSetConsultationPrice();

	async function handleSave() {
		const num = parseFloat(price);
		if (isNaN(num) || num <= 0) {
			toast.error("Informe um valor válido.");
			return;
		}
		try {
			await setPrice_(num);
			toast.success("Preço da consulta atualizado!");
		} catch {
			toast.error("Erro ao atualizar preço.");
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-base">
					<DollarSign className="h-4 w-4" />
					Preço da Consulta
				</CardTitle>
				<CardDescription>
					Valor cobrado por uma consulta padrão.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex items-end gap-3">
					<div className="space-y-1 flex-1 max-w-xs">
						<Label htmlFor="consultation-price">Valor (R$)</Label>
						<Input
							id="consultation-price"
							type="number"
							min={0}
							step={0.01}
							placeholder="Ex: 200.00"
							value={price}
							onChange={(e) => setPrice(e.target.value)}
							className="h-11"
						/>
					</div>
					<Button onClick={handleSave} disabled={isPending}>
						{isPending ? "Salvando..." : "Salvar"}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

function ServicesCard({ professionalId }: { professionalId: string }) {
	const { data: services = [], isLoading } =
		useGetProfessionalServices(professionalId);
	const [open, setOpen] = useState(false);
	const [editing, setEditing] = useState<ProfessionalService | null>(null);

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<div>
					<CardTitle className="flex items-center gap-2 text-base">
						<Briefcase className="h-4 w-4" />
						Procedimentos
					</CardTitle>
					<CardDescription>
						Serviços e procedimentos que você oferece.
					</CardDescription>
				</div>
				<Dialog
					open={open && !editing}
					onOpenChange={(v) => {
						setOpen(v);
						if (!v) setEditing(null);
					}}
				>
					<DialogTrigger asChild>
						<Button
							size="sm"
							onClick={() => {
								setEditing(null);
								setOpen(true);
							}}
						>
							<Plus className="h-4 w-4 mr-1" />
							Novo serviço
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Novo serviço</DialogTitle>
						</DialogHeader>
						<ServiceForm onClose={() => setOpen(false)} />
					</DialogContent>
				</Dialog>
			</CardHeader>
			<CardContent>
				{isLoading && (
					<p className="text-sm text-muted-foreground">Carregando...</p>
				)}
				{!isLoading && services.length === 0 && (
					<p className="text-sm text-muted-foreground py-4 text-center">
						Nenhum serviço cadastrado ainda.
					</p>
				)}
				<div className="space-y-3">
					{services.map((svc) => (
						<ServiceRow
							key={svc.id}
							service={svc}
							onEdit={() => {
								setEditing(svc);
								setOpen(true);
							}}
						/>
					))}
				</div>

				{/* Edit dialog */}
				<Dialog
					open={open && !!editing}
					onOpenChange={(v) => {
						setOpen(v);
						if (!v) setEditing(null);
					}}
				>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Editar serviço</DialogTitle>
						</DialogHeader>
						{editing && (
							<ServiceForm
								existing={editing}
								onClose={() => {
									setOpen(false);
									setEditing(null);
								}}
							/>
						)}
					</DialogContent>
				</Dialog>
			</CardContent>
		</Card>
	);
}

function ServiceRow({
	service,
	onEdit,
}: {
	service: ProfessionalService;
	onEdit: () => void;
}) {
	const { mutateAsync: deactivate, isPending } = useDeactivateService();

	async function handleDeactivate() {
		try {
			await deactivate(service.id);
			toast.success("Serviço desativado.");
		} catch {
			toast.error("Erro ao desativar serviço.");
		}
	}

	return (
		<div className="flex items-center justify-between rounded-xl border border-border p-4">
			<div className="space-y-1 flex-1 min-w-0">
				<div className="flex items-center gap-2 flex-wrap">
					<span className="font-medium text-sm">{service.name}</span>
					{service.requiresConsultation && (
						<Badge variant="outline" className="text-xs">
							Requer consulta
						</Badge>
					)}
				</div>
				{service.description && (
					<p className="text-xs text-muted-foreground truncate">
						{service.description}
					</p>
				)}
				<div className="flex items-center gap-4 text-xs text-muted-foreground">
					<span className="flex items-center gap-1">
						<DollarSign className="h-3 w-3" />
						R$ {service.price.toFixed(2)}
					</span>
					<span className="flex items-center gap-1">
						<Clock className="h-3 w-3" />
						{service.durationMinutes} min
					</span>
				</div>
			</div>
			<div className="flex items-center gap-2 ml-3 shrink-0">
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8"
					onClick={onEdit}
				>
					<Edit2 className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 text-destructive"
					onClick={handleDeactivate}
					disabled={isPending}
				>
					<Trash2 className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}

function ServiceForm({
	existing,
	onClose,
}: {
	existing?: ProfessionalService;
	onClose: () => void;
}) {
	const { mutateAsync: create, isPending: creating } = useCreateService();
	const { mutateAsync: update, isPending: updating } = useUpdateService();

	const form = useForm<CreateServiceInput>({
		resolver: zodResolver(createServiceSchema),
		defaultValues: existing
			? {
					name: existing.name,
					description: existing.description ?? "",
					price: existing.price,
					durationMinutes: existing.durationMinutes,
					requiresConsultation: existing.requiresConsultation,
				}
			: {
					name: "",
					description: "",
					price: 0,
					durationMinutes: 30,
					requiresConsultation: false,
				},
	});

	async function onSubmit(values: CreateServiceInput) {
		try {
			if (existing) {
				await update({ serviceId: existing.id, data: values });
				toast.success("Serviço atualizado!");
			} else {
				await create(values);
				toast.success("Serviço criado!");
			}
			onClose();
		} catch {
			toast.error("Erro ao salvar serviço.");
		}
	}

	const isPending = creating || updating;

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
			<div className="space-y-1">
				<Label htmlFor="name">Nome *</Label>
				<Input
					id="name"
					{...form.register("name")}
					placeholder="Ex: Limpeza de pele"
				/>
				{form.formState.errors.name && (
					<p className="text-xs text-destructive">
						{form.formState.errors.name.message}
					</p>
				)}
			</div>

			<div className="space-y-1">
				<Label htmlFor="description">Descrição</Label>
				<Input
					id="description"
					{...form.register("description")}
					placeholder="Opcional"
				/>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-1">
					<Label htmlFor="price">Preço (R$) *</Label>
					<Input
						id="price"
						type="number"
						min={0}
						step={0.01}
						{...form.register("price", { valueAsNumber: true })}
					/>
					{form.formState.errors.price && (
						<p className="text-xs text-destructive">
							{form.formState.errors.price.message}
						</p>
					)}
				</div>
				<div className="space-y-1">
					<Label htmlFor="duration">Duração (min) *</Label>
					<Input
						id="duration"
						type="number"
						min={1}
						{...form.register("durationMinutes", { valueAsNumber: true })}
					/>
					{form.formState.errors.durationMinutes && (
						<p className="text-xs text-destructive">
							{form.formState.errors.durationMinutes.message}
						</p>
					)}
				</div>
			</div>

			<div className="flex items-center gap-2">
				<Checkbox
					id="requiresConsultation"
					checked={form.watch("requiresConsultation")}
					onCheckedChange={(v) => form.setValue("requiresConsultation", !!v)}
				/>
				<Label
					htmlFor="requiresConsultation"
					className="cursor-pointer text-sm"
				>
					Requer consulta prévia
				</Label>
			</div>

			<div className="flex gap-2 pt-2">
				<Button type="submit" disabled={isPending} className="flex-1">
					{isPending ? "Salvando..." : existing ? "Atualizar" : "Criar serviço"}
				</Button>
				<Button type="button" variant="outline" onClick={onClose}>
					Cancelar
				</Button>
			</div>
		</form>
	);
}
