import { CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";
import { CustomButton } from "@/components/custom/custom-button";

const stats = [
	{ value: "10k+", label: "Consultas realizadas" },
	{ value: "500+", label: "Profissionais cadastrados" },
	{ value: "98%", label: "Satisfação" },
];

export function HeroSection() {
	return (
		<section className="relative z-10">
			<div className="container mx-auto flex min-h-[90vh] flex-col items-center justify-center px-4 py-20 text-center">
				<div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-5 py-2 text-sm font-medium text-primary shadow-sm backdrop-blur-sm">
					<Sparkles className="h-4 w-4" />
					Plataforma moderna para consultas online
				</div>

				<h1 className="mx-auto max-w-5xl text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
					Agende consultas médicas{" "}
					<span className="bg-gradient-to-r from-primary via-sky-400 to-secondary bg-clip-text text-transparent">
						em poucos segundos
					</span>
				</h1>

				<p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
					Conectamos você aos melhores profissionais da saúde com uma
					experiência rápida, moderna e segura.
				</p>

				<div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
					<Link href="/auth/register">
						<CustomButton>Criar conta</CustomButton>
					</Link>

					<Link href="/auth/login">
						<CustomButton variant="outline">Entrar</CustomButton>
					</Link>
				</div>

				<div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
					<div className="flex items-center gap-2">
						<CheckCircle2 className="h-4 w-4 text-primary" />
						Sem filas
					</div>

					<div className="flex items-center gap-2">
						<CheckCircle2 className="h-4 w-4 text-primary" />
						Agendamento online
					</div>

					<div className="flex items-center gap-2">
						<CheckCircle2 className="h-4 w-4 text-primary" />
						Profissionais verificados
					</div>
				</div>

				<div className="mx-auto mt-20 grid w-full max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3">
					{stats.map((stat) => (
						<div
							key={stat.label}
							className="group rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl"
						>
							<h3 className="text-3xl font-black text-primary">{stat.value}</h3>

							<p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
