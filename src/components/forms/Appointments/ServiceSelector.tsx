"use client";

import { Stethoscope } from "lucide-react";

import type { ProfessionalService } from "@/features/services";
import { useGetProfessionalServices } from "@/features/services";
import { formatBRL } from "@/utils/format-brl";
import { ConsultationOnlyServicesSection } from "./ConsultationOnlyServicesSection";
import type { ServiceSelectorProps } from "./ServiceSelector.types";

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
							? formatBRL(consultationPrice)
							: "Valor a combinar"}
					</p>
				</div>
			</button>

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
							{formatBRL(service.price)} · {service.durationMinutes} min
						</p>
					</div>
				</button>
			))}

			<ConsultationOnlyServicesSection services={consultationOnlyServices} />
		</div>
	);
}
