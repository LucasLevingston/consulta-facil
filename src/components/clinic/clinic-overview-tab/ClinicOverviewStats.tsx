import { Building2, Star, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
	memberCount: number;
	specialtyCount: number;
	ownerName: string | null | undefined;
}

export function ClinicOverviewStats({
	memberCount,
	specialtyCount,
	ownerName,
}: Props) {
	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle className="text-sm font-medium text-muted-foreground">
						Profissionais
					</CardTitle>
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
						<Users className="h-4 w-4 text-muted-foreground" />
					</div>
				</CardHeader>
				<CardContent>
					<p className="text-2xl font-bold">{memberCount}</p>
					<p className="mt-1 text-xs text-muted-foreground">
						profissional{memberCount !== 1 ? "is" : ""} cadastrado
						{memberCount !== 1 ? "s" : ""}
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle className="text-sm font-medium text-muted-foreground">
						Especialidades
					</CardTitle>
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
						<Star className="h-4 w-4 text-muted-foreground" />
					</div>
				</CardHeader>
				<CardContent>
					<p className="text-2xl font-bold">{specialtyCount}</p>
					<p className="mt-1 text-xs text-muted-foreground">
						área{specialtyCount !== 1 ? "s" : ""} de atuação
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle className="text-sm font-medium text-muted-foreground">
						Proprietário
					</CardTitle>
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
						<Building2 className="h-4 w-4 text-muted-foreground" />
					</div>
				</CardHeader>
				<CardContent>
					<p className="text-sm font-semibold truncate">{ownerName ?? "—"}</p>
					<p className="mt-1 text-xs text-muted-foreground">
						responsável pela clínica
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
