"use client";

import { useCheckInToken } from "@/hooks/api/appointments/use-check-in-token";

export function QrCodeDialog({ appointmentId }: { appointmentId: string }) {
	const { data, isLoading } = useCheckInToken(appointmentId);

	if (isLoading)
		return (
			<p className="text-sm text-muted-foreground text-center py-4">
				Gerando código...
			</p>
		);
	if (!data)
		return (
			<p className="text-sm text-destructive text-center py-4">
				Erro ao gerar código.
			</p>
		);

	// eslint-disable-next-line @typescript-eslint/no-require-imports
	const QRCodeSVG = require("qrcode.react").QRCodeSVG;
	return (
		<div className="flex flex-col items-center gap-4 py-2">
			<QRCodeSVG value={data.token} size={220} level="M" />
			<p className="text-xs text-muted-foreground text-center">
				Válido por 1 hora. Apresente à recepção ao chegar.
			</p>
		</div>
	);
}
