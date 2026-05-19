"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, BadgeCheck, Stethoscope } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import CustomFormField, { FormFieldType } from "@/components/custom/forms-components/custom-form-field";
import { CustomSubmitButton } from "@/components/custom/forms-components/custom-submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useCreateDoctor } from "@/hooks/api/use-doctors";
import { useUserStore } from "@/store/useUserStore";

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

export default function BecomeDoctorPage() {
	const router = useRouter();
	const { loadUser } = useUserStore();
	const { mutateAsync: createDoctor, isPending } = useCreateDoctor();

	const form = useForm<BecomeDoctorValues>({
		resolver: zodResolver(becomeDoctorSchema),
		defaultValues: { specialty: "", licenseNumber: "" },
	});

	async function onSubmit(values: BecomeDoctorValues) {
		try {
			await createDoctor(values);
			await loadUser();
			toast.success("Perfil de médico criado com sucesso!");
			router.push("/dashboard");
		} catch {
			toast.error("Erro ao criar perfil", {
				description: "Verifique os dados e tente novamente.",
			});
		}
	}

	return (
		<div className="mx-auto max-w-xl space-y-6">
			<Button variant="ghost" size="sm" className="gap-2 -ml-2" asChild>
				<Link href="/dashboard">
					<ArrowLeft className="h-4 w-4" />
					Voltar ao início
				</Link>
			</Button>

			{/* Hero */}
			<div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-6">
				<div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
				<div className="relative flex items-start gap-4">
					<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
						<Stethoscope className="h-6 w-6" />
					</div>
					<div>
						<h1 className="text-xl font-bold text-foreground">Cadastro como médico</h1>
						<p className="mt-1 text-sm text-muted-foreground">
							Informe sua especialidade e número de registro para começar a atender pacientes na plataforma.
						</p>
					</div>
				</div>
			</div>

			{/* Form */}
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
							>
								{SPECIALTIES.map((s) => (
									<option key={s} value={s}>
										{s}
									</option>
								))}
							</CustomFormField>

							<CustomFormField
								form={form}
								name="licenseNumber"
								fieldType={FormFieldType.INPUT}
								label="Número de registro (CRM)"
								placeholder="Ex: CRM/SP 123456"
							/>

							<CustomSubmitButton
								form={form}
								isSubmitting={isPending}
							>
								Cadastrar como médico
							</CustomSubmitButton>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
