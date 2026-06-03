"use client";

import { Briefcase, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useGetProfessionalServices } from "@/hooks/api/use-services";
import type { ProfessionalService } from "@/lib/schemas/service.schema";
import { ServiceForm } from "./ServiceForm";
import { ServiceRow } from "./ServiceRow";

export function ServicesCard({ professionalId }: { professionalId: string }) {
	const { data: services = [], isLoading } =
		useGetProfessionalServices(professionalId);
	const [open, setOpen] = useState(false);
	const [editing, setEditing] = useState<ProfessionalService | null>(null);

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<div>
					<CardTitle className="flex items-center gap-2 text-base">
						<Briefcase className="h-4 w-4" />
						Procedimentos
					</CardTitle>
					<CardDescription>
						Serviços e procedimentos que você oferece.
					</CardDescription>
				</div>
				<Dialog
					open={open && !editing}
					onOpenChange={(v) => {
						setOpen(v);
						if (!v) setEditing(null);
					}}
				>
					<DialogTrigger asChild>
						<Button
							size="sm"
							onClick={() => {
								setEditing(null);
								setOpen(true);
							}}
						>
							<Plus className="h-4 w-4 mr-1" />
							Novo serviço
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Novo serviço</DialogTitle>
						</DialogHeader>
						<ServiceForm onClose={() => setOpen(false)} />
					</DialogContent>
				</Dialog>
			</CardHeader>
			<CardContent>
				{isLoading && (
					<p className="text-sm text-muted-foreground">Carregando...</p>
				)}
				{!isLoading && services.length === 0 && (
					<p className="py-4 text-center text-sm text-muted-foreground">
						Nenhum serviço cadastrado ainda.
					</p>
				)}
				<div className="space-y-3">
					{services.map((svc) => (
						<ServiceRow
							key={svc.id}
							service={svc}
							onEdit={() => {
								setEditing(svc);
								setOpen(true);
							}}
						/>
					))}
				</div>

				<Dialog
					open={open && !!editing}
					onOpenChange={(v) => {
						setOpen(v);
						if (!v) setEditing(null);
					}}
				>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Editar serviço</DialogTitle>
						</DialogHeader>
						{editing && (
							<ServiceForm
								existing={editing}
								onClose={() => {
									setOpen(false);
									setEditing(null);
								}}
							/>
						)}
					</DialogContent>
				</Dialog>
			</CardContent>
		</Card>
	);
}
