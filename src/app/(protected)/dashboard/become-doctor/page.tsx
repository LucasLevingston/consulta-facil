"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, BadgeCheck, Clock, Stethoscope, XCircle } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import CustomFormField, { FormFieldType } from "@/components/custom/forms-components/custom-form-field";
import { CustomSubmitButton } from "@/components/custom/forms-components/custom-submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useApplicationStatus, useCreateDoctor } from "@/hooks/api/use-doctors";
import { QueryBoundary } from "@/providers/query-boundary";

const SPECIALTIES = [
	"Cardiologia",
	"Clínica Geral",
	"Dermatologia",
	"Gastroenterologia",
	"Neurologia",
	"Oftalmologia",
	"Ortopedia",
	"Pediatria",
	"Pneumologia",
	"Psiquiatria",
] as const;

const becomeDoctorSchema = z.object({
	specialty: z.string().min(1, "Selecione uma especialidade"),
	licenseNumber: z
		.string()
		.min(5, "Número de registro deve ter pelo menos 5 caracteres")
		.max(50, "Número de registro muito longo"),
});

type BecomeDoctorValues = z.infer<typeof becomeDoctorSchema>;

function ApplicationStatus() {
	const { data: application, isLoading, error } = useApplicationStatus();

	if (isLoading) return null;
	if (error || !application) return <BecomeDoctorForm />;

	if (application.status === "PENDING_REVIEW") {
		return (
			<div className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-amber-50 dark:bg-amber-950/20 p-8 text-center">
				<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600">
					<Clock className="h-7 w-7" />
				</div>
				<div>
					<h2 className="text-lg font-semibold text-foreground">Cadastro em análise</h2>
					<p className="mt-1 text-sm text-muted-foreground">
						Sua solicitação foi enviada e está aguardando aprovação. Você será notificado assim que uma decisão for tomada.
					</p>
				</div>
				<div className="mt-2 rounded-xl border border-amber-200 dark:border-amber-800 bg-white dark:bg-background px-4 py-3 text-left w-full">
					<p className="text-xs font-medium text-muted-foreground mb-1">Especialidade solicitada</p>
					<p className="text-sm font-semibold">{application.specialty}</p>
				</div>
				<Button variant="outline" asChild className="mt-2">
					<Link href="/dashboard">Voltar ao início</Link>
				</Button>
			</div>
		);
	}

	if (application.status === "REJECTED") {
		return (
			<div className="flex flex-col items-center gap-4 rounded-3xl border border-destructive/30 bg-destructive/5 p-8 text-center">
				<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
					<XCircle className="h-7 w-7" />
				</div>
				<div>
					<h2 className="text-lg font-semibold text-foreground">Cadastro não aprovado</h2>
					<p className="mt-1 text-sm text-muted-foreground">
						Sua solicitação não foi aprovada. Você pode entrar em contato com o suporte para mais informações.
					</p>
				</div>
				<Button variant="outline" asChild className="mt-2">
					<Link href="/dashboard">Voltar ao início</Link>
				</Button>
			</div>
		);
	}

	return <BecomeDoctorForm />;
}

function BecomeDoctorForm() {
	const { mutateAsync: createDoctor, isPending } = useCreateDoctor();

	const form = useForm<BecomeDoctorValues>({
		resolver: zodResolver(becomeDoctorSchema),
		defaultValues: { specialty: "", licenseNumber: "" },
	});

	async function onSubmit(values: BecomeDoctorValues) {
		try {
			await createDoctor(values);
			toast.success("Solicitação enviada com sucesso!", {
				description: "Sua candidatura está em análise. Aguarde a aprovação.",
			});
		} catch {
			toast.error("Erro ao enviar solicitação", {
				description: "Verifique os dados e tente novamente.",
			});
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-base">
					<BadgeCheck className="h-4 w-4 text-primary" />
					Dados profissionais
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<CustomFormField
							form={form}
							name="specialty"
							fieldType={FormFieldType.SELECT}
							label="Especialidade"
							placeholder="Selecione sua especialidade"
							selectOptions={SPECIALTIES.map((s) => ({ value: s, label: s }))}
						/>
						<CustomFormField
							form={form}
							name="licenseNumber"
							fieldType={FormFieldType.INPUT}
							label="Número de registro (CRM)"
							placeholder="Ex: CRM/SP 123456"
						/>

						<CustomSubmitButton form={form} isSubmitting={isPending}>
							Enviar solicitação
						</CustomSubmitButton>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}

export default function BecomeDoctorPage() {
	return (
		<div className="mx-auto max-w-xl space-y-6">
			<Button variant="ghost" size="sm" className="gap-2 -ml-2" asChild>
				<Link href="/dashboard">
					<ArrowLeft className="h-4 w-4" />
					Voltar ao início
				</Link>
			</Button>

			<div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-6">
				<div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
				<div className="relative flex items-start gap-4">
					<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
						<Stethoscope className="h-6 w-6" />
					</div>
					<div>
						<h1 className="text-xl font-bold text-foreground">Cadastro como médico</h1>
						<p className="mt-1 text-sm text-muted-foreground">
							Informe sua especialidade e número de registro. Sua solicitação passará por análise antes de ser ativada.
						</p>
					</div>
				</div>
			</div>

			<QueryBoundary isLoading={false} error={null}>
				<ApplicationStatus />
			</QueryBoundary>
		</div>
	);
}
