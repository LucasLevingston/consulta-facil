"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";

import "react-datepicker/dist/react-datepicker.css";

import { AppointmentForm } from "./forms/Appointments/AppointmentForm";
import { CancelAppointmentForm } from "./forms/Appointments/CancelAppointmentForm";

export const AppointmentModal = ({
	appointment,
	type,
	title,
	description,
}: {
	appointment?: AppointmentResponse;
	type: "schedule" | "cancel";
	title: string;
	description: string;
}) => {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className={
						type === "schedule"
							? "text-green-500 hover:text-green-400"
							: "text-destructive hover:text-destructive/80"
					}
				>
					{type === "schedule" ? "Agendar" : "Cancelar"}
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-md">
				<DialogHeader className="mb-4 space-y-3">
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>

				{type === "cancel" && appointment ? (
					<CancelAppointmentForm appointment={appointment} setOpen={setOpen} />
				) : (
					<AppointmentForm
						type={type}
						appointment={appointment}
						setOpen={setOpen}
					/>
				)}
			</DialogContent>
		</Dialog>
	);
};
