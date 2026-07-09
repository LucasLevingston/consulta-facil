import { ClipboardList, Search, Sparkles, UserCheck } from "lucide-react";

const steps = [
	{
		step: "01",
		icon: Search,
		title: "Encontre um profissional",
		desc: "Busque por especialidade, localização ou clínica. Veja perfis, avaliações e disponibilidade.",
	},
	{
		step: "02",
		icon: ClipboardList,
		title: "Escolha data e horário",
		desc: "Selecione o melhor horário disponível ou entre na fila de espera da clínica.",
	},
	{
		step: "03",
		icon: UserCheck,
		title: "Compareça e seja atendido",
		desc: "Chegue na clínica, faça check-in e acompanhe sua posição na fila em tempo real.",
	},
];

export function HowItWorksSection() {
	return (
		<section className="py-24">
			<div className="container mx-auto px-4">
				<div className="mx-auto mb-16 max-w-2xl text-center">
					<div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
						<Sparkles className="h-4 w-4" />
						Como funciona
					</div>
					<h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
						Agende em 3 passos simples
					</h2>
					<p className="mt-4 text-muted-foreground">
						Do cadastro à consulta em menos de 2 minutos.
					</p>
				</div>

				<div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
					{steps.map(({ step, icon: Icon, title, desc }) => (
						<div
							key={step}
							className="relative flex flex-col items-center text-center"
						>
							<div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
								<Icon className="h-7 w-7" />
							</div>
							<span className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
								Passo {step}
							</span>
							<h3 className="text-lg font-bold text-foreground">{title}</h3>
							<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
								{desc}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
