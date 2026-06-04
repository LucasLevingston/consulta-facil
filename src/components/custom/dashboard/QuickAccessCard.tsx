"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { QuickCard } from "./dashboard-quick-cards";

export function QuickAccessCard({
	title,
	description,
	href,
	icon: Icon,
	accent,
}: QuickCard) {
	return (
		<Link href={href} className="group block">
			<Card className="h-full border-border transition-all hover:border-primary/40 hover:shadow-md">
				<CardContent className="flex items-start gap-4 p-5">
					<div
						className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${accent}`}
					>
						<Icon className="h-5 w-5" />
					</div>
					<div className="min-w-0 flex-1">
						<p className="font-semibold text-foreground">{title}</p>
						<p className="mt-0.5 text-xs text-muted-foreground">
							{description}
						</p>
					</div>
					<ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
				</CardContent>
			</Card>
		</Link>
	);
}
