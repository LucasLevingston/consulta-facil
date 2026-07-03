"use client";

import { CreditCard } from "lucide-react";
import { CustomButton } from "@/components/custom/custom-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreatePayment } from "@/features/appointments";
import type { AppointmentPaymentSectionProps } from "./AppointmentPaymentSection.types";

export function AppointmentPaymentSection({
	appointment,
}: AppointmentPaymentSectionProps) {
	const { mutateAsync: createPayment, isPending: creatingPayment } =
		useCreatePayment();

	if (appointment.paymentStatus === "PAID") {
		return (
			<Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
				<CardContent className="py-3 flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
					<CreditCard className="h-4 w-4" />
					Pagamento confirmado
					{appointment.paymentAmount && (
						<span className="ml-auto font-medium">
							R$ {appointment.paymentAmount.toFixed(2)}
						</span>
					)}
				</CardContent>
			</Card>
		);
	}

	if (appointment.status === "CANCELED") {
		return null;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
					<CreditCard className="h-4 w-4" />
					Pagamento antecipado
				</CardTitle>
			</CardHeader>
			<CardContent className="-mt-2 flex flex-col gap-3">
				<p className="text-sm text-muted-foreground">
					{appointment.paymentStatus === "PENDING_PAYMENT"
						? "Pagamento pendente. Conclua no link abaixo."
						: "Pague antecipadamente e garanta seu atendimento."}
				</p>
				<CustomButton
					size="sm"
					className="gap-2 w-fit"
					disabled={creatingPayment}
					onClick={async () => {
						const result = await createPayment({
							appointmentId: appointment.id,
						});
						window.open(result.checkoutUrl, "_blank");
					}}
				>
					<CreditCard className="h-4 w-4" />
					{creatingPayment ? "Processando..." : "Pagar consulta"}
				</CustomButton>
			</CardContent>
		</Card>
	);
}
