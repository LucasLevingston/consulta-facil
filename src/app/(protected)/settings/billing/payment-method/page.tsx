"use client";

import { ArrowLeft, CreditCard, Info } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/custom/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useMySubscription } from "@/features/subscriptions";

export default function PaymentMethodPage() {
	const { data: subscription } = useMySubscription();
	const hasActiveSubscription = subscription?.status === "ACTIVE";

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-3">
				<Button variant="ghost" size="icon" asChild>
					<Link href="/settings/billing">
						<ArrowLeft className="h-4 w-4" />
					</Link>
				</Button>
				<PageHeader
					title="Método de Pagamento"
					description="Gerencie o método de pagamento da sua assinatura."
				/>
			</div>

			{!hasActiveSubscription && (
				<Alert>
					<Info className="h-4 w-4" />
					<AlertTitle>Sem assinatura ativa</AlertTitle>
					<AlertDescription>
						Você não possui uma assinatura ativa. Assine um plano para gerenciar
						seu método de pagamento.{" "}
						<Link href="/settings/billing" className="underline font-medium">
							Ver planos
						</Link>
					</AlertDescription>
				</Alert>
			)}

			{hasActiveSubscription && (
				<Card>
					<CardHeader>
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
								<CreditCard className="h-5 w-5 text-muted-foreground" />
							</div>
							<div>
								<CardTitle className="text-base">
									Pagamento via gateway
								</CardTitle>
								<CardDescription>
									Seu método de pagamento é gerenciado pelo gateway de
									pagamento.
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<Alert>
							<Info className="h-4 w-4" />
							<AlertTitle>Gerenciamento externo</AlertTitle>
							<AlertDescription>
								Para atualizar seu cartão ou método de pagamento, acesse o
								portal do cliente no gateway de pagamento. Entre em contato com
								o suporte caso precise de ajuda.
							</AlertDescription>
						</Alert>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
