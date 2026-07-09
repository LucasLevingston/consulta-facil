import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Shield, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { UserResponse } from "@/lib/schemas/user/user-response.schema";

const ROLE_LABELS: Record<string, string> = {
	PATIENT: "Paciente",
	PROFESSIONAL: "Profissional",
	ADMIN: "Admin",
	RECEPTIONIST: "Recepcionista",
};

const ROLE_VARIANTS: Record<
	string,
	"default" | "secondary" | "destructive" | "outline"
> = {
	PATIENT: "secondary",
	PROFESSIONAL: "default",
	ADMIN: "destructive",
	RECEPTIONIST: "outline",
};

export function UserRoleCard({ user }: { user: UserResponse }) {
	return (
		<Card className="border-border transition-shadow hover:shadow-md">
			<CardContent className="p-5">
				<div className="flex items-start gap-4">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
						{user.role === "ADMIN" ? (
							<Shield className="h-5 w-5 text-primary" />
						) : (
							<User className="h-5 w-5 text-primary" />
						)}
					</div>

					<div className="min-w-0 flex-1">
						<p className="truncate font-semibold text-foreground">
							{user.name ?? "—"}
						</p>
						<p className="truncate text-xs text-muted-foreground mt-0.5">
							{user.email ?? "—"}
						</p>

						<div className="mt-2 flex flex-wrap gap-2">
							{user.role && (
								<Badge
									variant={ROLE_VARIANTS[user.role] ?? "secondary"}
									className="text-xs"
								>
									{ROLE_LABELS[user.role] ?? user.role}
								</Badge>
							)}
						</div>

						{user.createdAt && (
							<p className="mt-2 text-xs text-muted-foreground">
								Cadastro:{" "}
								{format(new Date(user.createdAt), "dd/MM/yyyy", {
									locale: ptBR,
								})}
							</p>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
