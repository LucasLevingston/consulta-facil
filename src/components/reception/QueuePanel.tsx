"use client";

import { RefreshCw, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { QueueCard } from "./QueueCard";
import { useQueue } from "./use-queue";

export function QueuePanel() {
	const { data: queue = [], isLoading, refetch, isFetching } = useQueue();

	const checkedIn = queue.filter((a) => a.status === "CHECKED_IN");
	const inProgress = queue.filter((a) => a.status === "IN_PROGRESS");

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
						<User className="h-4 w-4" />
						Fila de espera ({checkedIn.length})
					</CardTitle>
					<Button
						size="icon"
						variant="ghost"
						className="h-7 w-7"
						onClick={() => refetch()}
						disabled={isFetching}
					>
						<RefreshCw
							className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
						/>
					</Button>
				</div>
			</CardHeader>
			<CardContent className="-mt-2 space-y-4">
				{isLoading ? (
					<p className="text-sm text-muted-foreground">Carregando...</p>
				) : queue.length === 0 ? (
					<p className="text-sm text-muted-foreground">
						Nenhum paciente na fila.
					</p>
				) : (
					<>
						{inProgress.length > 0 && (
							<div className="space-y-2">
								<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
									Em atendimento
								</p>
								{inProgress.map((a) => (
									<QueueCard key={a.id} appointment={a} />
								))}
							</div>
						)}
						{inProgress.length > 0 && checkedIn.length > 0 && <Separator />}
						{checkedIn.length > 0 && (
							<div className="space-y-2">
								<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
									Aguardando
								</p>
								{checkedIn.map((a) => (
									<QueueCard key={a.id} appointment={a} />
								))}
							</div>
						)}
					</>
				)}
			</CardContent>
		</Card>
	);
}
