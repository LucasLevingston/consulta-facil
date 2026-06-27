"use client";

import { CheckCircle2, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import type { PlanCardProps } from "./plan-card.types";

const YEARLY_SAVINGS: Record<string, string> = {
	yearly: "Economize R$ 179,88",
	"clinic-yearly": "Economize 10%",
};

export function PlanCard({
	plan,
	subscription,
	onSelect,
	isPending,
}: PlanCardProps) {
	const isActive =
		subscription?.status === "ACTIVE" && subscription.planId === plan.id;
	const savings = YEARLY_SAVINGS[plan.id];

	return (
		<Card
			className={cn(
				"relative flex flex-col justify-between transition-all duration-200",
				plan.highlight
					? "border-primary shadow-lg shadow-primary/10 ring-1 ring-primary/20"
					: "border-border",
				isActive && "ring-2 ring-green-500/40",
			)}
		>
			{(plan.highlight || isActive) && (
				<div className="absolute -top-3 left-4 flex gap-2">
					{plan.highlight && !isActive && (
						<Badge className="bg-primary text-primary-foreground shadow-sm">
							Mais popular
						</Badge>
					)}
					{isActive && (
						<Badge className="bg-green-500 text-white shadow-sm">
							✓ Plano atual
						</Badge>
					)}
				</div>
			)}

			<CardHeader
				className={cn("pb-4", (plan.highlight || isActive) && "pt-6")}
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 text-primary">
						{plan.icon}
						<span className="font-semibold">{plan.title}</span>
					</div>
					{savings && (
						<Badge
							variant="secondary"
							className="text-xs bg-green-500/10 text-green-600 border-green-500/20"
						>
							{savings}
						</Badge>
					)}
				</div>

				<div className="mt-3 space-y-0.5">
					<div className="flex items-end gap-1">
						<span className="text-3xl font-bold text-foreground">
							R$ {plan.monthlyEquiv}
						</span>
						<span className="mb-1 text-sm text-muted-foreground">/mês</span>
					</div>
					{plan.period === "/ano" && (
						<p className="text-xs text-muted-foreground">
							Cobrado anualmente — R$ {plan.totalPrice}
						</p>
					)}
				</div>

				<p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
			</CardHeader>

			<CardContent className="space-y-2">
				{plan.features.map((feature) => (
					<div key={feature} className="flex items-center gap-2 text-sm">
						<CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
						<span className="text-foreground">{feature}</span>
					</div>
				))}
			</CardContent>

			<CardFooter className="pt-4">
				{isActive ? (
					<Button className="w-full" variant="outline" disabled>
						<CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
						Plano atual
					</Button>
				) : (
					<Button
						className="w-full"
						variant={plan.highlight ? "default" : "outline"}
						onClick={() => onSelect(plan.id)}
						disabled={isPending}
					>
						{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Assinar agora
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}
