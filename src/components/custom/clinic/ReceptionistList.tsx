"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Receptionist = {
	id: string;
	name?: string | null;
	email?: string | null;
};

interface Props {
	receptionists: Receptionist[];
	onRemove: (id: string) => void;
}

export function ReceptionistList({ receptionists, onRemove }: Props) {
	return (
		<div className="space-y-2">
			{receptionists.map((r) => (
				<Card key={r.id}>
					<CardContent className="py-3 flex items-center justify-between">
						<div>
							<p className="text-sm font-medium">{r.name}</p>
							<p className="text-xs text-muted-foreground">{r.email}</p>
						</div>
						<Button
							size="icon"
							variant="ghost"
							className="text-destructive hover:text-destructive"
							onClick={() => onRemove(r.id)}
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
