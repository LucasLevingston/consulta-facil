import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "@/providers";

const inter = Inter({
	variable: "--font-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "ConsultaFácil",
	description:
		"Um sistema de gerenciamento de pacientes em saúde projetado para simplificar o registro de pacientes, agendamento de consultas e gerenciamento de prontuários médicos para prestadores de serviços de saúde.",
	icons: {
		icon: "/assets/icons/logo-icon.svg",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="pt-BR"
			className={`${inter.variable} font-sans h-full antialiased`}
			suppressHydrationWarning
		>
			<head>
				<link rel="icon" href="/logo.png" />
			</head>
			<body className="min-h-screen">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
