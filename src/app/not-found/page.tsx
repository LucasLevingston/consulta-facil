"use client";

import { useRouter } from "next/navigation";
import { CustomButton } from "@/components/custom/custom-button";
import { PageLayout } from "@/components/custom/page-layout";

export default function NotFound() {
	const router = useRouter();

	return (
		<PageLayout className="items-center justify-center text-center ">
			<h2 className="font-heading my-2 text-2xl font-bold">
				Página não encontrada
			</h2>
			<p>Desculpe, essa página não existe</p>
			<div>
				<CustomButton onClick={() => router.back()}>Voltar</CustomButton>
				<CustomButton
					onClick={() => router.push("/dashboard")}
					variant="outline"
				>
					Ir para página inicial
				</CustomButton>
			</div>
		</PageLayout>
	);
}
