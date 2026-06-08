import { Stethoscope } from "lucide-react";

import { ApplicationStatus } from "@/components/become-professional/ApplicationStatus";
import { PageLayout } from "@/components/custom/page-layout";

export default function BecomeProfessionalPage() {
	return (
		<PageLayout>
			<div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-6">
				<div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
				<div className="relative flex items-start gap-4">
					<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
						<Stethoscope className="h-6 w-6" />
					</div>
					<div>
						<h1 className="text-xl font-bold text-foreground">
							Cadastro como profissional de saúde
						</h1>
						<p className="mt-1 text-sm text-muted-foreground">
							Selecione sua profissão e especialidade. Sua solicitação passará
							por análise antes de ser ativada.
						</p>
					</div>
				</div>
			</div>

			<ApplicationStatus />
		</PageLayout>
	);
}
