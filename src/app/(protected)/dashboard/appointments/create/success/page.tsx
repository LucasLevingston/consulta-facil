"use client";

import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function RequestSuccess() {
	return (
		<div className="flex px-[5%] w-full flex items-center justify-center">
			<div className="success-img flex items-center justify-center flex-col">
				<Logo />

				<section className="flex flex-col items-center">
					<Image
						src="/assets/gifs/success.gif"
						height={300}
						width={280}
						alt="sucesso"
					/>
					<h2 className="header mb-6 max-w-[600px] text-center">
						Sua <span className="text-green-500">solicitação de consulta</span>{" "}
						foi enviada com sucesso!
					</h2>
					<p>Entraremos em contato em breve para confirmar.</p>
				</section>

				<Button
					variant="outline"
					className="shad-primary-btn font-bold"
					asChild
				>
					<Link href="/dashboard/appointments/create">Nova Consulta</Link>
				</Button>
			</div>
		</div>
	);
}
