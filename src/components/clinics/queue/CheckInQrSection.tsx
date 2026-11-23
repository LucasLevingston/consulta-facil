"use client";

import { QrCode } from "lucide-react";
import dynamic from "next/dynamic";
import type { CheckInQrSectionProps } from "./CheckInQrSection.types";

const QRCodeSVG = dynamic(
	() => import("qrcode.react").then((mod) => mod.QRCodeSVG),
	{ ssr: false },
);

export function CheckInQrSection({ clinicId }: CheckInQrSectionProps) {
	const url =
		typeof window !== "undefined"
			? `${window.location.origin}/clinics/${clinicId}/checkin`
			: `/clinics/${clinicId}/checkin`;

	return (
		<div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5">
			<div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
				<QrCode className="h-4 w-4" />
				QR Code para check-in dos pacientes
			</div>
			<div className="rounded-xl bg-white p-3 shadow-sm">
				<QRCodeSVG value={url} size={140} level="M" />
			</div>
			<p className="text-xs text-muted-foreground text-center max-w-xs">
				Pacientes escaneiam este código com o celular para entrar na fila.
			</p>
		</div>
	);
}
