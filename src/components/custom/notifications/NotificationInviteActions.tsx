"use client";

import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAcceptInvite } from "./use-accept-invite";
import { useDeclineInvite } from "./use-decline-invite";

interface Props {
	notificationId: string;
	type: string;
	status: string;
}

export function NotificationInviteActions({
	notificationId,
	type,
	status,
}: Props) {
	const accept = useAcceptInvite();
	const decline = useDeclineInvite();

	if (type !== "CLINIC_INVITE") return null;

	return (
		<>
			{status === "PENDING" && (
				<div className="flex gap-2 pl-9">
					<Button
						size="sm"
						className="h-7 rounded-lg px-3 text-xs"
						disabled={accept.isPending || decline.isPending}
						onClick={() =>
							accept.mutate(notificationId, {
								onSuccess: () => toast.success("Você entrou na clínica!"),
								onError: () => toast.error("Erro ao aceitar convite."),
							})
						}
					>
						<Check className="mr-1 h-3 w-3" />
						Aceitar
					</Button>
					<Button
						size="sm"
						variant="outline"
						className="h-7 rounded-lg px-3 text-xs"
						disabled={accept.isPending || decline.isPending}
						onClick={() =>
							decline.mutate(notificationId, {
								onSuccess: () => toast.info("Convite recusado."),
								onError: () => toast.error("Erro ao recusar convite."),
							})
						}
					>
						<X className="mr-1 h-3 w-3" />
						Recusar
					</Button>
				</div>
			)}
			{status === "ACCEPTED" && (
				<p className="pl-9 text-xs text-emerald-600 dark:text-emerald-400">
					Convite aceito
				</p>
			)}
			{status === "DECLINED" && (
				<p className="pl-9 text-xs text-muted-foreground">Convite recusado</p>
			)}
		</>
	);
}
