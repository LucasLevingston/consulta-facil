"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MagicLinkRequestFormProps {
	onSubmit: (email: string) => Promise<void>;
	isPending: boolean;
}

export default function MagicLinkRequestForm({
	onSubmit,
	isPending,
}: MagicLinkRequestFormProps) {
	const [email, setEmail] = useState("");

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!email.trim()) return;
		await onSubmit(email.trim().toLowerCase());
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4" noValidate>
			<div className="space-y-1.5">
				<Label htmlFor="ml-email">E-mail</Label>
				<Input
					id="ml-email"
					type="email"
					autoComplete="email"
					placeholder="seu@email.com"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
			</div>

			<Button
				type="submit"
				className="w-full"
				disabled={isPending || !email.trim()}
				aria-busy={isPending}
			>
				{isPending ? (
					<span className="flex items-center gap-2">
						<svg
							className="w-4 h-4 animate-spin"
							fill="none"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							/>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
							/>
						</svg>
						Enviando...
					</span>
				) : (
					"Enviar link de acesso"
				)}
			</Button>
		</form>
	);
}
