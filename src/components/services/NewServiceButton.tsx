"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ServiceForm } from "./ServiceForm";

export function NewServiceButton() {
	const [open, setOpen] = useState(false);
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="sm" onClick={() => setOpen(true)}>
					<Plus className="mr-1 h-4 w-4" />
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
	);
}
