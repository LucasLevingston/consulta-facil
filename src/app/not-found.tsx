import { Home } from "lucide-react";
import Link from "next/link";
import { CustomButton } from "@/components/custom/custom-button";
import "@/app/glitch.css";

export default function NotFound() {
	return (
		<div className=" flex items-center justify-center p-4 overflow-hidden">
			<div className="text-center space-y-8 max-w-2xl mx-auto">
				<div className="relative">
					<h1 className="text-9xl md:text-[12rem] font-black glitch-text select-none text-transparent">
						404
					</h1>
					<h1 className="absolute inset-0 text-9xl md:text-[12rem] font-black glitch-text-shadow select-none text-slate-100">
						404
					</h1>
					<h1 className="absolute inset-0 text-9xl md:text-[12rem] font-black glitch-text-shadow-2 select-none text-neutral-900">
						404
					</h1>
				</div>

				<div className="space-y-4">
					<p className="text-xl md:text-2xl glitch-message font-extralight text-neutral-500">
						Página não encontrada
					</p>
				</div>

				<div className="pt-4">
					<CustomButton asChild size="lg">
						<Link href="/" className="flex items-center gap-2">
							<Home className="w-4 h-4 transition-transform group-hover:scale-110" />
							Go Home
						</Link>
					</CustomButton>
				</div>

				<div className="absolute inset-0 pointer-events-none">
					<div className="glitch-line glitch-line-1"></div>
				</div>
			</div>
		</div>
	);
}
