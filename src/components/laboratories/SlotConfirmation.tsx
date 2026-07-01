"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function formatTime(time: string) {
	return time.slice(0, 5);
}

interface Props {
	selectedDate: Date;
	selectedTime: string;
	isPending: boolean;
	onConfirm: () => void;
}

export function SlotConfirmation({
	selectedDate,
	selectedTime,
	isPending,
	onConfirm,
}: Props) {
	return (
		<div className="space-y-3">
			<Separator />
			<div className="rounded-xl bg-primary/5 border border-primary/20 p-3 text-sm space-y-0.5">
				<p className="font-semibold text-primary">Resumo do agendamento</p>
				<p className="text-muted-foreground">
					{format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", {
						locale: ptBR,
					})}{" "}
					às {formatTime(selectedTime)}
				</p>
			</div>
			<Button
				className="w-full gap-2 min-h-[44px]"
				onClick={onConfirm}
				disabled={isPending}
			>
				{isPending ? (
					<Loader2 className="h-4 w-4 animate-spin" />
				) : (
					<CheckCircle2 className="h-4 w-4" />
				)}
				{isPending ? "Agendando..." : "Confirmar agendamento"}
			</Button>
		</div>
	);
}
