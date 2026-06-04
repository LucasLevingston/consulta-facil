"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";

const planLabel: Record<string, string> = {
	monthly: "Pro Mensal",
	yearly: "Pro Anual",
};

function BillingSuccessContent() {
	const params = useSearchParams();
	const planId = params.get("planId") ?? "";

	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
			<div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
				<CheckCircle2 className="h-10 w-10 text-green-500" />
			</div>
			<div className="space-y-2">
				<h1 className="text-2xl font-bold text-foreground">
					Pagamento confirmado!
				</h1>
				<p className="text-muted-foreground">
					Seu plano{" "}
					<span className="font-semibold text-foreground">
						{planLabel[planId] ?? "Pro"}
					</span>{" "}
					foi ativado com sucesso.
				</p>
			</div>
			<Link href="/dashboard">
				<Button>Ir para o dashboard</Button>
			</Link>
		</div>
	);
}

export default function BillingSuccessPage() {
	return (
		<Suspense>
			<BillingSuccessContent />
		</Suspense>
	);
}
