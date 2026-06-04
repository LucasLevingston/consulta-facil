"use client";

import { QrCode } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCheckInByQr } from "@/hooks/api/appointments/use-check-in-by-qr";

export function CheckInPanel() {
	const { mutateAsync: checkIn, isPending } = useCheckInByQr();
	const [token, setToken] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	async function handleCheckIn() {
		const t = token.trim();
		if (!t) return;
		try {
			const result = await checkIn(t);
			toast.success(`Check-in realizado: ${result.patientName}`);
			setToken("");
			inputRef.current?.focus();
		} catch {
			toast.error("Token inválido ou expirado.");
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
					<QrCode className="h-4 w-4" />
					Check-in por QR Code
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3 -mt-2">
				<p className="text-xs text-muted-foreground">
					Cole ou digitalize o token do QR Code do paciente abaixo.
				</p>
				<div className="flex gap-2">
					<Input
						ref={inputRef}
						value={token}
						onChange={(e) => setToken(e.target.value)}
						placeholder="Token do QR Code..."
						className="flex-1 font-mono text-xs"
						onKeyDown={(e) => e.key === "Enter" && handleCheckIn()}
					/>
					<Button onClick={handleCheckIn} disabled={isPending || !token.trim()}>
						{isPending ? "Aguarde..." : "Check-in"}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
