import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { PaymentResultProps } from "./PaymentResult.types";

export function PaymentResult({
	icon,
	title,
	description,
	buttonLabel,
	buttonHref,
	buttonVariant = "default",
}: PaymentResultProps) {
	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
			{icon}
			<div className="space-y-2">
				<h1 className="text-2xl font-bold text-foreground">{title}</h1>
				<p className="text-muted-foreground">{description}</p>
			</div>
			<Link href={buttonHref}>
				<Button variant={buttonVariant}>{buttonLabel}</Button>
			</Link>
		</div>
	);
}
