"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { RateAppointmentFormProps } from "./RateAppointmentForm.types";
import { StarRating } from "./StarRating";
import { useRateAppointment } from "./use-rate-appointment";

export function RateAppointmentForm({
	appointment,
	setOpen,
}: RateAppointmentFormProps) {
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

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			<p className="text-sm text-muted-foreground">
				Como foi sua consulta com{" "}
				<span className="font-semibold text-foreground">
					{appointment.professionalName ?? "o profissional"}
				</span>
				?
			</p>

			<StarRating
				active={active}
				onStarClick={setStars}
				onStarHover={setHovered}
				onMouseLeave={() => setHovered(0)}
			/>

			<div className="space-y-1.5">
				<label htmlFor="rating-comment" className="text-sm font-medium">
					Comentário{" "}
					<span className="text-muted-foreground font-normal">(opcional)</span>
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
				<p className="text-xs text-muted-foreground text-right">
					{comment.length}/500
				</p>
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
