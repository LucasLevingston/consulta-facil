"use client";

import { Sparkles } from "lucide-react";
import { AnamnesisAIChat } from "@/components/anamnesis/AnamnesisAIChat";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { AnamnesisInput } from "@/features/appointments";

interface Props {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSave: (data: AnamnesisInput) => Promise<void>;
}

export function AnamnesisAIChatDialog({ open, onOpenChange, onSave }: Props) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader className="mb-2 space-y-1">
					<DialogTitle className="flex items-center gap-2">
						<Sparkles className="h-4 w-4 text-primary" />
						Preencher anamnese com IA
					</DialogTitle>
					<DialogDescription>
						Responda às perguntas do assistente. Ao terminar, clique em
						&ldquo;Salvar na anamnese&rdquo;.
					</DialogDescription>
				</DialogHeader>
				<AnamnesisAIChat onSave={onSave} onClose={() => onOpenChange(false)} />
			</DialogContent>
		</Dialog>
	);
}
