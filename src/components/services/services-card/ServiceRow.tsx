"use client";

import { Clock, DollarSign, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDeactivateService } from "@/features/services";
import type { ServiceRowProps } from "./ServiceRow.types";

export function ServiceRow({ service, onEdit }: ServiceRowProps) {
	const { mutateAsync: deactivate, isPending } = useDeactivateService();

	async function handleDeactivate() {
		try {
			await deactivate(service.id);
			toast.success("Serviço removido.");
		} catch {
			toast.error("Erro ao remover serviço.");
		}
	}

	return (
		<div className="flex items-center justify-between rounded-xl border border-border p-4">
			<div className="flex-1 min-w-0 space-y-1">
				<div className="flex items-center gap-2 flex-wrap">
					<span className="font-medium text-sm">{service.name}</span>
					{service.requiresConsultation && (
						<Badge variant="outline" className="text-xs">
							Requer consulta
						</Badge>
					)}
				</div>
				{service.description && (
					<p className="text-xs text-muted-foreground truncate">
						{service.description}
					</p>
				)}
				<div className="flex items-center gap-4 text-xs text-muted-foreground">
					<span className="flex items-center gap-1">
						<DollarSign className="h-3 w-3" />
						R$ {service.price.toFixed(2)}
					</span>
					<span className="flex items-center gap-1">
						<Clock className="h-3 w-3" />
						{service.durationMinutes} min
					</span>
				</div>
			</div>
			<div className="flex items-center gap-2 ml-3 shrink-0">
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8"
					onClick={onEdit}
				>
					<Edit2 className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 text-destructive"
					onClick={handleDeactivate}
					disabled={isPending}
				>
					<Trash2 className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
