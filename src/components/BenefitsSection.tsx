import { Calendar, Shield, Star, Stethoscope } from "lucide-react";

const benefits = [
	{
		icon: Stethoscope,
		title: "Especialistas verificados",
		desc: "Todos os profissionais passam por validação de registro.",
	},
	{
		icon: Calendar,
		title: "Agendamento 24/7",
		desc: "Marque consultas a qualquer hora e em qualquer lugar.",
	},
	{
		icon: Shield,
		title: "Segurança garantida",
		desc: "Seus dados protegidos com total privacidade.",
	},
];

export function BenefitsSection() {
	return (
		<section className="relative border-y border-border/50 bg-card/40 py-20 backdrop-blur-xl">
			<div className="container mx-auto px-4">
				<div className="mx-auto mb-14 max-w-2xl text-center">
					<div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
						<Star className="h-4 w-4 fill-primary" />
						Benefícios
					</div>

					<h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
						Tudo que você precisa para cuidar da sua saúde
					</h2>

					<p className="mt-4 text-muted-foreground">
						Uma plataforma pensada para tornar o agendamento médico mais
						simples, rápido e seguro.
					</p>
				</div>

				<div className="grid gap-6 md:grid-cols-3">
					{benefits.map(({ icon: Icon, title, desc }) => (
						<div
							key={title}
							className="group rounded-3xl border border-border/60 bg-background/60 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl"
						>
							<div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
								<Icon className="h-6 w-6" />
							</div>

							<h3 className="text-lg font-bold text-foreground">{title}</h3>

							<p className="mt-2 leading-relaxed text-muted-foreground">
								{desc}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
