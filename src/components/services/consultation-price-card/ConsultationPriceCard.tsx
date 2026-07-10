"use client";

import { DollarSign } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ConsultationPriceCardProps } from "./ConsultationPriceCard.types";
import { useSetConsultationPrice } from "./use-set-consultation-price";

export function ConsultationPriceCard({
	consultationPrice,
}: ConsultationPriceCardProps) {
	const [price, setPrice] = useState(consultationPrice?.toString() ?? "");
	const { mutateAsync: setPrice_, isPending } = useSetConsultationPrice();

	async function handleSave() {
		const num = parseFloat(price);
		if (Number.isNaN(num) || num <= 0) {
			toast.error("Informe um valor válido.");
			return;
		}
		try {
			await setPrice_(num);
			toast.success("Preço da consulta atualizado!");
		} catch {
			toast.error("Erro ao atualizar preço.");
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-base">
					<DollarSign className="h-4 w-4" />
					Preço da Consulta
				</CardTitle>
				<CardDescription>
					Valor cobrado por uma consulta padrão.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex items-end gap-3">
					<div className="flex-1 max-w-xs space-y-1">
						<Label htmlFor="consultation-price">Valor (R$)</Label>
						<Input
							id="consultation-price"
							type="number"
							min={0}
							step={0.01}
							placeholder="Ex: 200.00"
							value={price}
							onChange={(e) => setPrice(e.target.value)}
							className="h-11"
						/>
					</div>
					<Button onClick={handleSave} disabled={isPending}>
						{isPending ? "Salvando..." : "Salvar"}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
