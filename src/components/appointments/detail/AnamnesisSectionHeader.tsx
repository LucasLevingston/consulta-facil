"use client";

import { ClipboardList, Sparkles } from "lucide-react";
import { CustomButton } from "@/components/custom/custom-button";
import { CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
	canEdit: boolean;
	editing: boolean;
	showAiHelper: boolean;
	hasAnamnesis: boolean;
	onStartEdit: () => void;
	onOpenAi: () => void;
}

export function AnamnesisSectionHeader({
	canEdit,
	editing,
	showAiHelper,
	hasAnamnesis,
	onStartEdit,
	onOpenAi,
}: Props) {
	return (
		<CardHeader>
			<div className="flex items-center justify-between">
				<CardTitle className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
					<ClipboardList className="h-4 w-4" />
					Anamnese
				</CardTitle>
				{canEdit && !editing && (
					<div className="flex gap-2">
						{showAiHelper && (
							<CustomButton
								variant="outline"
								size="sm"
								className="gap-1.5"
								onClick={onOpenAi}
							>
								<Sparkles className="h-3.5 w-3.5 text-primary" />
								Preencher com IA
							</CustomButton>
						)}
						<CustomButton variant="outline" onClick={onStartEdit}>
							{hasAnamnesis ? "Editar" : "Preencher"}
						</CustomButton>
					</div>
				)}
			</div>
		</CardHeader>
	);
}
