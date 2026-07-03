"use client";

import { AlertTriangle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatBRL } from "@/utils/format-brl";
import type { ConsultationOnlyServicesSectionProps } from "./ConsultationOnlyServicesSection.types";

export function ConsultationOnlyServicesSection({
	services,
}: ConsultationOnlyServicesSectionProps) {
	if (services.length === 0) return null;

	return (
		<div className="pt-2">
			<p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
				<AlertTriangle className="h-3 w-3 text-amber-500" />
				Disponíveis apenas após consulta (solicitados pelo profissional):
			</p>
			{services.map((service) => (
				<div
					key={service.id}
					className="w-full flex items-start gap-3 rounded-xl border border-dashed border-border p-4 opacity-50 cursor-not-allowed"
				>
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 flex-wrap">
							<p className="text-sm font-semibold text-foreground">
								{service.name}
							</p>
							<Badge
								variant="outline"
								className="text-xs border-amber-400 text-amber-600 gap-1"
							>
								<AlertTriangle className="h-3 w-3" />
								requer consulta prévia
							</Badge>
						</div>
						{service.description && (
							<p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
								{service.description}
							</p>
						)}
						<p className="text-xs text-muted-foreground mt-1">
							{formatBRL(service.price)} · {service.durationMinutes} min
						</p>
					</div>
				</div>
			))}
		</div>
	);
}
