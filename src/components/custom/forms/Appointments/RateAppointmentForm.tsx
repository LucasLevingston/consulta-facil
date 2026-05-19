"use client";

import { Star } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRateAppointment } from "@/hooks/api/use-appointments";
import type { AppointmentResponse } from "@/lib/schemas/appointment.schema";

interface RateAppointmentFormProps {
	appointment: AppointmentResponse;
	setOpen: Dispatch<SetStateAction<boolean>>;
}

export function RateAppointmentForm({ appointment, setOpen }: RateAppointmentFormProps) {
	const [stars, setStars] = useState(0);
	const [hovered, setHovered] = useState(0);
	const [comment, setComment] = useState("");

	const rate = useRateAppointment();
	const active = hovered || stars;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (stars === 0) {
			toast.error("Selecione uma avaliação de 1 a 5 estrelas.");
			return;
		}
		try {
			await rate.mutateAsync({
				id: appointment.id,
				data: { stars, comment: comment.trim() || undefined },
			});
			toast.success("Avaliação enviada com sucesso!");
			setOpen(false);
		} catch {
			toast.error("Erro ao enviar avaliação.");
		}
	};

	const labels: Record<number, string> = {
		1: "Ruim",
		2: "Regular",
		3: "Bom",
		4: "Muito bom",
		5: "Excelente",
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			<p className="text-sm text-muted-foreground">
				Como foi sua consulta com{" "}
				<span className="font-semibold text-foreground">
					{appointment.doctorName ? `Dr. ${appointment.doctorName}` : "o médico"}
				</span>
				?
			</p>

			<div className="flex flex-col items-center gap-2">
				<div
					className="flex gap-1"
					onMouseLeave={() => setHovered(0)}
				>
					{[1, 2, 3, 4, 5].map((star) => (
						<button
							key={star}
							type="button"
							onClick={() => setStars(star)}
							onMouseEnter={() => setHovered(star)}
							className="p-1 rounded transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							aria-label={`${star} estrela${star > 1 ? "s" : ""}`}
						>
							<Star
								className={`size-8 transition-colors ${
									star <= active
										? "fill-amber-400 text-amber-400"
										: "text-muted-foreground/40"
								}`}
							/>
						</button>
					))}
				</div>
				<span className="text-sm font-medium h-5 text-muted-foreground">
					{active > 0 ? labels[active] : ""}
				</span>
			</div>

			<div className="space-y-1.5">
				<label htmlFor="rating-comment" className="text-sm font-medium">
					Comentário <span className="text-muted-foreground font-normal">(opcional)</span>
				</label>
				<Textarea
					id="rating-comment"
					placeholder="Conte como foi sua experiência..."
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					maxLength={500}
					rows={3}
					className="resize-none"
				/>
				<p className="text-xs text-muted-foreground text-right">{comment.length}/500</p>
			</div>

			<Button
				type="submit"
				className="w-full"
				disabled={stars === 0 || rate.isPending}
			>
				{rate.isPending ? "Enviando..." : "Enviar avaliação"}
			</Button>
		</form>
	);
}
