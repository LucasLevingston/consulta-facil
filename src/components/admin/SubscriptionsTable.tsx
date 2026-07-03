"use client";

import { Ban, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { AdminSubscriptionResponse } from "@/features/subscriptions";
import { OWNER_LABELS, STATUS_CONFIG } from "./subscriptions-table.constants";

interface Props {
	subscriptions: AdminSubscriptionResponse[];
	onCancel: (sub: AdminSubscriptionResponse) => void;
	cancelPending: boolean;
}

export function SubscriptionsTable({
	subscriptions,
	onCancel,
	cancelPending,
}: Props) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Usuário</TableHead>
					<TableHead>Plano</TableHead>
					<TableHead>Tipo</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Expira em</TableHead>
					<TableHead>Criado em</TableHead>
					<TableHead>Ações</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{subscriptions.map((sub) => {
					const cfg = STATUS_CONFIG[sub.status] ?? {
						label: sub.status,
						variant: "outline" as const,
					};
					return (
						<TableRow key={sub.id}>
							<TableCell>
								<p className="font-medium text-sm">{sub.userEmail}</p>
							</TableCell>
							<TableCell>{sub.planName}</TableCell>
							<TableCell>
								{OWNER_LABELS[sub.ownerType] ?? sub.ownerType}
							</TableCell>
							<TableCell>
								<Badge variant={cfg.variant}>{cfg.label}</Badge>
							</TableCell>
							<TableCell className="text-sm text-muted-foreground">
								{sub.expiresAt
									? new Date(sub.expiresAt).toLocaleDateString("pt-BR")
									: "—"}
							</TableCell>
							<TableCell className="text-sm text-muted-foreground">
								{new Date(sub.createdAt).toLocaleDateString("pt-BR")}
							</TableCell>
							<TableCell>
								{sub.status === "ACTIVE" && (
									<Button
										size="sm"
										variant="ghost"
										onClick={() => onCancel(sub)}
										disabled={cancelPending}
										className="text-destructive hover:text-destructive gap-1.5"
									>
										{cancelPending ? (
											<Loader2 className="h-3.5 w-3.5 animate-spin" />
										) : (
											<Ban className="h-3.5 w-3.5" />
										)}
										Cancelar
									</Button>
								)}
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
}
