"use client";

import { AlertTriangle, Stethoscope } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useGetProfessionalServices } from "@/hooks/api/services/use-get-professional-services";
import type { ProfessionalService } from "@/lib/schemas/service/professional-service.schema";

interface ServiceSelectorProps {
	professionalId: string;
	consultationPrice: number | null | undefined;
	value: string | null;
	onChange: (id: string | null) => void;
}

function formatPrice(price: number): string {
	return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function ServiceSelector({
	professionalId,
	consultationPrice,
	value,
	onChange,
}: ServiceSelectorProps) {
	const { data: services = [], isLoading } =
		useGetProfessionalServices(professionalId);
	const activeServices = (services as ProfessionalService[]).filter(
		(s) => s.active,
	);
	const directServices = activeServices.filter((s) => !s.requiresConsultation);
	const consultationOnlyServices = activeServices.filter(
		(s) => s.requiresConsultation,
	);

	if (isLoading) {
		return (
			<p className="text-xs text-muted-foreground py-2">
				Carregando serviços...
			</p>
		);
	}

	return (
		<div className="space-y-2">
			{/* Standard consultation */}
			<button
				type="button"
				onClick={() => onChange(null)}
				className={`w-full flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
					value === null
						? "border-primary bg-primary/5"
						: "border-border hover:border-primary/40"
				}`}
			>
				<Stethoscope
					className={`h-4 w-4 mt-0.5 shrink-0 ${value === null ? "text-primary" : "text-muted-foreground"}`}
				/>
				<div className="flex-1 min-w-0">
					<p
						className={`text-sm font-semibold ${value === null ? "text-primary" : "text-foreground"}`}
					>
						Consulta
					</p>
					<p className="text-xs text-muted-foreground">
						{consultationPrice != null
							? formatPrice(consultationPrice)
							: "Valor a combinar"}
					</p>
				</div>
			</button>

			{/* Direct procedures — no prior consultation needed */}
			{directServices.map((service) => (
				<button
					key={service.id}
					type="button"
					onClick={() => onChange(service.id)}
					className={`w-full flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
						value === service.id
							? "border-primary bg-primary/5"
							: "border-border hover:border-primary/40"
					}`}
				>
					<div className="flex-1 min-w-0">
						<p
							className={`text-sm font-semibold ${value === service.id ? "text-primary" : "text-foreground"}`}
						>
							{service.name}
						</p>
						{service.description && (
							<p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
								{service.description}
							</p>
						)}
						<p className="text-xs text-muted-foreground mt-1">
							{formatPrice(service.price)} · {service.durationMinutes} min
						</p>
					</div>
				</button>
			))}

			{/* Consultation-only services — informational, not selectable */}
			{consultationOnlyServices.length > 0 && (
				<div className="pt-2">
					<p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
						<AlertTriangle className="h-3 w-3 text-amber-500" />
						Disponíveis apenas após consulta (solicitados pelo profissional):
					</p>
					{consultationOnlyServices.map((service) => (
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
									{formatPrice(service.price)} · {service.durationMinutes} min
								</p>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
