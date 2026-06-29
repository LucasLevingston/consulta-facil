"use client";

import { ArrowLeft, BadgeCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import PageHeader from "@/components/custom/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlans } from "@/features/plans";
import { useCreateCheckout, useMySubscription } from "@/features/subscriptions";

const PERIOD_LABELS: Record<string, string> = {
	MONTHLY: "mês",
	SEMIANNUAL: "semestre",
	ANNUAL: "ano",
};

function formatBRL(value: number) {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(value);
}

export default function ChangePlanPage() {
	const { data: plans = [], isLoading: plansLoading } = usePlans();
	const { data: subscription } = useMySubscription();
	const checkout = useCreateCheckout();

	function handleSelect(planId: string) {
		if (planId === subscription?.planId) return;
		checkout.mutate(planId, {
			onError: () => toast.error("Erro ao iniciar checkout."),
		});
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-3">
				<Button variant="ghost" size="icon" asChild>
					<Link href="/settings/billing">
						<ArrowLeft className="h-4 w-4" />
					</Link>
				</Button>
				<PageHeader
					title="Trocar Plano"
					description="Escolha um novo plano para sua conta."
				/>
			</div>

			{plansLoading ? (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{[1, 2, 3].map((i) => (
						<Skeleton key={i} className="h-48 w-full" />
					))}
				</div>
			) : (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{plans.map((plan) => {
						const isCurrent = plan.id === subscription?.planId;
						return (
							<Card
								key={plan.id}
								className={
									isCurrent ? "border-primary ring-1 ring-primary" : ""
								}
							>
								<CardHeader className="pb-2">
									<div className="flex items-center justify-between">
										<CardTitle className="text-base">{plan.name}</CardTitle>
										{isCurrent && (
											<Badge className="gap-1">
												<BadgeCheck className="h-3 w-3" />
												Atual
											</Badge>
										)}
									</div>
									{plan.description && (
										<p className="text-xs text-muted-foreground">
											{plan.description}
										</p>
									)}
								</CardHeader>
								<CardContent>
									<p className="text-2xl font-bold">
										{formatBRL(plan.price)}
										<span className="text-sm font-normal text-muted-foreground">
											/{PERIOD_LABELS[plan.billingPeriod] ?? plan.billingPeriod}
										</span>
									</p>
								</CardContent>
								<CardFooter>
									<Button
										className="w-full"
										variant={isCurrent ? "outline" : "default"}
										disabled={isCurrent || checkout.isPending}
										onClick={() => handleSelect(plan.id)}
									>
										{checkout.isPending && !isCurrent ? (
											<Loader2 className="h-4 w-4 animate-spin mr-2" />
										) : null}
										{isCurrent ? "Plano atual" : "Selecionar"}
									</Button>
								</CardFooter>
							</Card>
						);
					})}
				</div>
			)}
		</div>
	);
}
