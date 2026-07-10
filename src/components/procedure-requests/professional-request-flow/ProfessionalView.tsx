"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { CreateProcedureRequestForm } from "./CreateProcedureRequestForm";
import { ProfessionalRequestCard } from "./ProfessionalRequestCard";
import type { ProfessionalViewProps } from "./ProfessionalView.types";

export function ProfessionalView({
	requests,
	professionalId,
}: ProfessionalViewProps) {
	const [open, setOpen] = useState(false);

	return (
		<div className="space-y-4 max-w-3xl">
			<div className="flex justify-end">
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button size="sm">
							<Plus className="h-4 w-4 mr-1" />
							Nova solicitação
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Nova solicitação de procedimento</DialogTitle>
						</DialogHeader>
						<CreateProcedureRequestForm
							professionalId={professionalId}
							onClose={() => setOpen(false)}
						/>
					</DialogContent>
				</Dialog>
			</div>

			{requests.length === 0 ? (
				<Card>
					<CardContent className="py-12 text-center text-sm text-muted-foreground">
						Nenhuma solicitação criada ainda.
					</CardContent>
				</Card>
			) : (
				<div className="space-y-3">
					{requests.map((req) => (
						<ProfessionalRequestCard key={req.id} request={req} />
					))}
				</div>
			)}
		</div>
	);
}
