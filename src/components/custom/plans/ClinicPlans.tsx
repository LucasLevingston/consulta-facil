"use client";

import {
	Building2,
	CheckCircle2,
	Crown,
	Minus,
	Plus,
	Star,
	Users,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useMyClinic } from "@/hooks/api/clinics/use-my-clinic";
import { useCreateCheckout } from "@/hooks/api/subscriptions/use-create-checkout";
import { useMySubscription } from "@/hooks/api/subscriptions/use-my-subscription";
import { QueryBoundary } from "@/providers/query-boundary";
import { FREE_CONSULTS_PER_DOCTOR } from "@/utils/constants/free-consults-per-doctor";
import { FREE_PROFESSIONALS } from "@/utils/constants/free-professionals";

import { BASE_PRICE } from "../../../lib/utils/base-price";
import { PlanCard } from "./plan-card";
import { SubscriptionBanner } from "./subscription-banner";
import type { Plan } from "./types";

function calcMonthlyPrice(totalProfessionals: number): number {
	const extra = Math.max(0, totalProfessionals - FREE_PROFESSIONALS);
	return BASE_PRICE * (1 + extra * 0.2);
}

function fmtBRL(value: number) {
	return value.toLocaleString("pt-BR", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

const CLINIC_PLANS: Plan[] = [
	{
		id: "clinic-monthly",
		title: "Clínica Mensal",
		monthlyEquiv: fmtBRL(BASE_PRICE),
		totalPrice: fmtBRL(BASE_PRICE),
		period: "/mês",
		description: `Para clínicas com até ${FREE_PROFESSIONALS} profissionais. Cada profissional extra soma +20%.`,
		icon: <Building2 className="h-5 w-5" />,
		features: [
			`${FREE_PROFESSIONALS} profissionais incluídos no preço base`,
			"Consultas ilimitadas após o período grátis",
			"Perfil de clínica no mapa",
			"Badge de clínica verificada",
		],
	},
	{
		id: "clinic-yearly",
		title: "Clínica Anual",
		monthlyEquiv: fmtBRL(BASE_PRICE * 0.9),
		totalPrice: fmtBRL(BASE_PRICE * 12 * 0.9),
		period: "/ano",
		description: "Economize 10% pagando anualmente.",
		icon: <Crown className="h-5 w-5" />,
		highlight: true,
		features: [
			"Tudo do plano mensal",
			`Economia de R$ ${fmtBRL(BASE_PRICE * 12 * 0.1)}/ano`,
			"Destaque nos resultados de busca",
			"Relatórios de agendamentos",
		],
	},
];

export default function ClinicPlans() {
	const { data: subscription, isLoading, error } = useMySubscription();
	const { data: myClinics = [] } = useMyClinic();
	const checkout = useCreateCheckout();

	const myClinic = myClinics[0] ?? null;
	const currentProfessionals = myClinic?.members?.length ?? 1;

	const [calcProfessionals, setCalcProfessionals] = useState(
		Math.max(currentProfessionals, 1),
	);

	const calcPrice = calcMonthlyPrice(calcProfessionals);
	const extraProfessionals = Math.max(
		0,
		calcProfessionals - FREE_PROFESSIONALS,
	);
	const isFree = calcProfessionals <= FREE_PROFESSIONALS;

	function handleSelect(planId: string) {
		checkout.mutate(planId, {
			onError: () => toast.error("Erro ao iniciar checkout."),
		});
	}

	return (
		<QueryBoundary isLoading={isLoading} error={error}>
			{/* Modelo freemium — 3 info cards */}
			<div className="grid gap-4 sm:grid-cols-3">
				{(
					[
						{
							icon: Users,
							label: `${FREE_PROFESSIONALS} profissionais grátis`,
							desc: `Clínicas com até ${FREE_PROFESSIONALS} profissionais não pagam plano.`,
						},
						{
							icon: Star,
							label: `${FREE_CONSULTS_PER_DOCTOR} consultas por profissional`,
							desc: `Cada profissional tem ${FREE_CONSULTS_PER_DOCTOR} agendamentos gratuitos pelo sistema.`,
						},
						{
							icon: Zap,
							label: "+20% por profissional extra",
							desc: `A partir do ${FREE_PROFESSIONALS + 1}º profissional, cada um soma 20% ao valor base.`,
						},
					] as const
				).map(({ icon: Icon, label, desc }) => (
					<Card key={label} className="border-dashed">
						<CardContent className="pt-5 pb-4">
							<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
								<Icon className="h-4 w-4 text-primary" />
							</div>
							<p className="mt-3 text-sm font-semibold text-foreground">
								{label}
							</p>
							<p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Uso atual da clínica */}
			{myClinic && (
				<Card>
					<CardHeader className="pb-3">
						<div className="flex items-center gap-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
								<Building2 className="h-4 w-4 text-primary" />
							</div>
							<div>
								<CardTitle className="text-base">{myClinic.name}</CardTitle>
								<CardDescription>Uso atual da sua clínica</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent className="grid gap-6 sm:grid-cols-2">
						<div>
							<div className="flex items-center justify-between text-sm mb-2">
								<span className="text-muted-foreground">
									Profissionais na clínica
								</span>
								<span className="font-semibold tabular-nums">
									{currentProfessionals} / {FREE_PROFESSIONALS}
								</span>
							</div>
							<div className="h-2 rounded-full bg-muted overflow-hidden">
								<div
									className="h-full rounded-full bg-primary transition-all"
									style={{
										width: `${Math.min(100, (currentProfessionals / FREE_PROFESSIONALS) * 100)}%`,
									}}
								/>
							</div>
							<p className="mt-1.5 text-xs text-muted-foreground">
								{currentProfessionals >= FREE_PROFESSIONALS
									? "Limite gratuito atingido — plano necessário para adicionar mais"
									: `${FREE_PROFESSIONALS - currentProfessionals} vaga${FREE_PROFESSIONALS - currentProfessionals !== 1 ? "s" : ""} gratuita${FREE_PROFESSIONALS - currentProfessionals !== 1 ? "s" : ""} restante${FREE_PROFESSIONALS - currentProfessionals !== 1 ? "s" : ""}`}
							</p>
						</div>
						<div>
							<div className="flex items-center justify-between text-sm mb-2">
								<span className="text-muted-foreground">
									Consultas gratuitas
								</span>
								<span className="font-semibold tabular-nums">
									{currentProfessionals * FREE_CONSULTS_PER_DOCTOR}
								</span>
							</div>
							<div className="flex flex-wrap gap-1 mt-1">
								<Badge variant="secondary" className="text-xs">
									{FREE_CONSULTS_PER_DOCTOR} por profissional
								</Badge>
								<Badge variant="secondary" className="text-xs">
									× {currentProfessionals} profissional
									{currentProfessionals !== 1 ? "is" : ""}
								</Badge>
							</div>
							<p className="mt-1.5 text-xs text-muted-foreground">
								Após esgotar, assinatura obrigatória para novos agendamentos.
							</p>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Calculadora de preço */}
			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-base">Calculadora de preço</CardTitle>
					<CardDescription>
						Simule o custo mensal conforme o número de profissionais na clínica
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-5">
					<div className="flex items-center justify-between gap-4">
						<span className="text-sm text-muted-foreground">
							Quantidade de profissionais
						</span>
						<div className="flex items-center gap-3">
							<Button
								variant="outline"
								size="icon"
								className="h-8 w-8 rounded-lg"
								onClick={() => setCalcProfessionals((n) => Math.max(1, n - 1))}
							>
								<Minus className="h-3 w-3" />
							</Button>
							<span className="w-8 text-center text-lg font-semibold tabular-nums">
								{calcProfessionals}
							</span>
							<Button
								variant="outline"
								size="icon"
								className="h-8 w-8 rounded-lg"
								onClick={() => setCalcProfessionals((n) => Math.min(50, n + 1))}
							>
								<Plus className="h-3 w-3" />
							</Button>
						</div>
					</div>

					<Separator />

					<div className="flex items-end justify-between gap-4">
						<div>
							{isFree ? (
								<>
									<p className="text-3xl font-bold text-emerald-600">Grátis</p>
									<p className="mt-0.5 text-xs text-muted-foreground">
										{calcProfessionals * FREE_CONSULTS_PER_DOCTOR} consultas
										gratuitas incluídas
									</p>
								</>
							) : (
								<>
									<p className="text-3xl font-bold text-foreground">
										R$ {fmtBRL(calcPrice)}
										<span className="text-base font-normal text-muted-foreground">
											/mês
										</span>
									</p>
									<p className="mt-0.5 text-xs text-muted-foreground">
										Base R$ {fmtBRL(BASE_PRICE)} + {extraProfessionals}{" "}
										profissional
										{extraProfessionals !== 1 ? "is" : ""} extra (
										{extraProfessionals * 20}% adicional)
									</p>
								</>
							)}
						</div>
						<div className="shrink-0 text-right">
							{isFree ? (
								<Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400">
									<CheckCircle2 className="mr-1 h-3 w-3" />
									Plano grátis
								</Badge>
							) : (
								<Badge variant="secondary">
									{extraProfessionals} além do limite
								</Badge>
							)}
						</div>
					</div>

					{calcProfessionals > FREE_PROFESSIONALS && (
						<div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
							<p className="font-medium text-foreground">
								Composição do preço:
							</p>
							<p>
								Base ({FREE_PROFESSIONALS} profissionais): R${" "}
								{fmtBRL(BASE_PRICE)}
							</p>
							{Array.from({ length: extraProfessionals }, (_, i) => {
								const doctorNumber = FREE_PROFESSIONALS + i + 1;
								return (
									<p key={doctorNumber}>
										{doctorNumber}º profissional (+20%): R${" "}
										{fmtBRL(BASE_PRICE * 0.2)}
									</p>
								);
							})}
							<Separator className="my-1" />
							<p className="font-semibold text-foreground">
								Total: R$ {fmtBRL(calcPrice)}/mês
							</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Banner de assinatura ativa */}
			{subscription &&
				subscription.status !== "EXPIRED" &&
				(subscription.planId === "clinic-monthly" ||
					subscription.planId === "clinic-yearly") && (
					<SubscriptionBanner subscription={subscription} />
				)}

			{/* Planos pagos */}
			<div>
				<h2 className="text-lg font-semibold text-foreground">Planos pagos</h2>
				<p className="mt-1 text-sm text-muted-foreground">
					Necessário após esgotar as consultas gratuitas ou ao adicionar mais de{" "}
					{FREE_PROFESSIONALS} profissionais. O preço final varia conforme o
					número de profissionais.
				</p>
			</div>

			<div className="grid gap-6 sm:grid-cols-2">
				{CLINIC_PLANS.map((plan) => (
					<PlanCard
						key={plan.id}
						plan={plan}
						subscription={subscription}
						onSelect={handleSelect}
						isPending={checkout.isPending}
					/>
				))}
			</div>
		</QueryBoundary>
	);
}
