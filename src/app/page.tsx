"use client";

import {
	ArrowRight,
	Calendar,
	CheckCircle2,
	ClipboardList,
	Search,
	Shield,
	Sparkles,
	Star,
	Stethoscope,
	UserCheck,
} from "lucide-react";
import Link from "next/link";

import { CustomButton } from "@/components/custom/custom-button";
import { FeaturesSection } from "@/components/FeaturesSection";

const stats = [
	{
		value: "10k+",
		label: "Consultas realizadas",
	},
	{
		value: "500+",
		label: "Profissionais cadastrados",
	},
	{
		value: "98%",
		label: "Satisfação",
	},
];

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

export default function Home() {
	return (
		<main>
			{/* Background */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />

				<div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

				<div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
			</div>

			{/* Hero */}
			<section className="relative z-10">
				<div className="container mx-auto flex min-h-[90vh] flex-col items-center justify-center px-4 py-20 text-center">
					{/* Badge */}
					<div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-5 py-2 text-sm font-medium text-primary shadow-sm backdrop-blur-sm">
						<Sparkles className="h-4 w-4" />
						Plataforma moderna para consultas online
					</div>

					{/* Title */}
					<h1 className="mx-auto max-w-5xl text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
						Agende consultas médicas{" "}
						<span className="bg-gradient-to-r from-primary via-sky-400 to-secondary bg-clip-text text-transparent">
							em poucos segundos
						</span>
					</h1>

					{/* Subtitle */}
					<p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
						Conectamos você aos melhores profissionais da saúde com uma
						experiência rápida, moderna e segura.
					</p>

					{/* CTA */}
					<div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
						<Link href="/auth/register">
							<CustomButton>Criar conta</CustomButton>
						</Link>

						<Link href="/auth/login">
							<CustomButton variant="outline">Entrar</CustomButton>
						</Link>
					</div>

					{/* Mini features */}
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

					{/* Stats */}
					<div className="mx-auto mt-20 grid w-full max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3">
						{stats.map((stat) => (
							<div
								key={stat.label}
								className="group rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl"
							>
								<h3 className="text-3xl font-black text-primary">
									{stat.value}
								</h3>

								<p className="mt-2 text-sm text-muted-foreground">
									{stat.label}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Features */}
			<FeaturesSection />

			{/* Benefits */}
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

			{/* Como funciona */}
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
						{[
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
						].map(({ step, icon: Icon, title, desc }) => (
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

			{/* Bottom CTA */}
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
		</main>
	);
}
