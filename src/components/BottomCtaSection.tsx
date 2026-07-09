import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CustomButton } from "@/components/custom/custom-button";

export function BottomCtaSection() {
	return (
		<section className="border-t border-border/50 bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
			<div className="container mx-auto flex flex-col items-center gap-6 px-4 text-center">
				<h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
					Pronto para começar?
				</h2>
				<p className="max-w-xl text-muted-foreground">
					Junte-se a milhares de pacientes que já cuidam da saúde com mais
					praticidade.
				</p>
				<div className="flex flex-col items-center gap-3 sm:flex-row">
					<Link href="/auth/register">
						<CustomButton className="gap-2">
							Criar conta grátis
							<ArrowRight className="h-4 w-4" />
						</CustomButton>
					</Link>
					<Link href="/professionals">
						<CustomButton variant="outline">
							Explorar profissionais
						</CustomButton>
					</Link>
				</div>
			</div>
		</section>
	);
}
