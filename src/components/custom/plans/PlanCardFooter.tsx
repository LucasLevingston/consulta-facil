"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";

interface Props {
	isActive: boolean;
	isPending: boolean;
	highlight: boolean;
	onSelect: () => void;
}

export function PlanCardFooter({
	isActive,
	isPending,
	highlight,
	onSelect,
}: Props) {
	return (
		<CardFooter className="pt-4">
			{isActive ? (
				<Button className="w-full" variant="outline" disabled>
					<CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
					Plano atual
				</Button>
			) : (
				<Button
					className="w-full"
					variant={highlight ? "default" : "outline"}
					onClick={onSelect}
					disabled={isPending}
				>
					{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					Assinar agora
				</Button>
			)}
		</CardFooter>
	);
}
