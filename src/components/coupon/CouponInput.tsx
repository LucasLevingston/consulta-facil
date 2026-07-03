"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useValidateCoupon } from "@/features/billing";
import type { CouponInputProps } from "./CouponInput.types";

const brl = (n: number) =>
	new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(n);

export function CouponInput({ amount, userId, onApply }: CouponInputProps) {
	const [code, setCode] = useState("");
	const validate = useValidateCoupon();

	const handleValidate = () => {
		validate.mutate(
			{ code, userId, amount },
			{
				onSuccess: (result) => {
					onApply?.(result);
				},
			},
		);
	};

	return (
		<div className="space-y-2">
			<div className="flex gap-2">
				<Input
					placeholder="Codigo do cupom"
					value={code}
					onChange={(e) => setCode(e.target.value.toUpperCase())}
				/>
				<Button
					onClick={handleValidate}
					disabled={!code || validate.isPending}
					variant="outline"
				>
					{validate.isPending ? "Validando..." : "Validar"}
				</Button>
			</div>
			{validate.data && (
				<p
					className={
						validate.data.valid
							? "text-sm text-green-600"
							: "text-sm text-destructive"
					}
				>
					{validate.data.valid
						? `Desconto: ${brl(validate.data.discountAmount)} — Total: ${brl(validate.data.finalAmount)}`
						: validate.data.message}
				</p>
			)}
		</div>
	);
}
