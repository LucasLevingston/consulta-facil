import { Logo } from "@/components/logo";

export default function AuthLeftPanel() {
	return (
		<div className="hidden lg:flex lg:w-1/2 xl:w-5/12 bg-primary flex-col justify-between p-12 relative overflow-hidden">
			<div className="absolute inset-0 opacity-10">
				<svg
					width="100%"
					height="100%"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
					role="presentation"
				>
					<defs>
						<pattern
							id="dots"
							x="0"
							y="0"
							width="32"
							height="32"
							patternUnits="userSpaceOnUse"
						>
							<circle cx="4" cy="4" r="2" fill="white" />
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#dots)" />
				</svg>
			</div>

			<div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
			<div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-white/5" />

			<Logo />

			<div className="relative z-10 space-y-8">
				<div className="w-20 h-20 bg-white/15 rounded-3xl flex items-center justify-center">
					<svg
						className="w-10 h-10 text-white"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
						/>
					</svg>
				</div>

				<div className="space-y-4">
					<h1 className="text-white text-3xl xl:text-4xl font-bold leading-tight">
						Saúde conectada,
						<br />
						cuidado simplificado
					</h1>
					<p className="text-white/70 text-base leading-relaxed max-w-sm">
						Gerencie consultas, pacientes e prontuários em um só lugar. Seguro,
						rápido e intuitivo.
					</p>
				</div>

				<div className="flex gap-8">
					{[
						{ value: "10k+", label: "Consultas" },
						{ value: "500+", label: "Profissionais" },
						{ value: "98%", label: "Satisfação" },
					].map((stat) => (
						<div key={stat.label} className="space-y-1">
							<div className="text-white font-bold text-2xl">{stat.value}</div>
							<div className="text-white/60 text-sm">{stat.label}</div>
						</div>
					))}
				</div>
			</div>

			<div className="relative z-10">
				<p className="text-white/50 text-sm">
					&ldquo;A saúde é o maior bem que um ser humano pode possuir.&rdquo;
				</p>
			</div>
		</div>
	);
}
