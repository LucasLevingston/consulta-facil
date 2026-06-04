"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loading } from "@/components/custom/loading";
import PatientDetailsForm from "@/components/forms/PatientDetails/PatientDetailsForm";
import { Logo } from "@/components/logo";
import { useAuthStore } from "@/store/auth.store";
import { useUserStore } from "@/store/useUserStore";

export default function CompletarCadastroPage() {
	const router = useRouter();
	const { isAuthenticated } = useAuthStore();
	const { user } = useUserStore();

	useEffect(() => {
		if (!isAuthenticated) router.push("/auth/login");
	}, [isAuthenticated, router]);

	if (!user) return <Loading />;

	return (
		<div className="flex min-h-screen flex-col items-center px-4 py-10">
			<Logo className="mb-8" />
			<div className="w-full max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8">
				<div className="mb-8 space-y-1">
					<h1 className="text-2xl font-bold text-foreground">
						Complete seu cadastro
					</h1>
					<p className="text-sm text-muted-foreground">
						Preencha suas informações para começar a agendar consultas.
					</p>
				</div>
				<PatientDetailsForm
					userId={user.id}
					userEmail={user.email}
					type="create"
				/>
			</div>
		</div>
	);
}
