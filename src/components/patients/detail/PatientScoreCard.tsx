import { CheckCircle2, CreditCard, TrendingUp, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PatientScoreCardProps } from "./PatientScoreCard.types";
import { PatientScoreStatItem } from "./PatientScoreStatItem";

export function PatientScoreCard({ appointments }: PatientScoreCardProps) {
	const completed = appointments.filter((a) => a.status === "COMPLETED").length;
	const canceled = appointments.filter((a) => a.status === "CANCELED").length;
	const total = appointments.length;
	const decisive = completed + canceled;
	const attendanceRate =
		decisive > 0 ? Math.round((completed / decisive) * 100) : null;
	const withPayment = appointments.filter(
		(a) => a.paymentStatus === "PAID" || a.paymentStatus === "PENDING_PAYMENT",
	);
	const paid = withPayment.filter((a) => a.paymentStatus === "PAID").length;
	const paymentRate =
		withPayment.length > 0
			? Math.round((paid / withPayment.length) * 100)
			: null;
	const score =
		attendanceRate !== null && paymentRate !== null
			? Math.round(attendanceRate * 0.6 + paymentRate * 0.4)
			: (attendanceRate ?? paymentRate ?? null);
	if (total === 0) return null;
	const scoreColor =
		score === null
			? "text-muted-foreground"
			: score >= 80
				? "text-green-600 dark:text-green-400"
				: score >= 50
					? "text-yellow-600 dark:text-yellow-400"
					: "text-red-600 dark:text-red-400";
	const scoreBg =
		score === null
			? "bg-muted/30"
			: score >= 80
				? "bg-green-500/10"
				: score >= 50
					? "bg-yellow-500/10"
					: "bg-red-500/10";

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-base">
					<TrendingUp className="h-4 w-4" />
					Score do paciente
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col gap-4 sm:flex-row sm:items-start">
					{score !== null && (
						<div
							className={`flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl ${scoreBg}`}
						>
							<span className={`text-3xl font-bold ${scoreColor}`}>
								{score}
							</span>
							<span className="text-xs text-muted-foreground">/ 100</span>
						</div>
					)}
					<div className="flex flex-1 flex-wrap gap-4">
						{attendanceRate !== null && (
							<PatientScoreStatItem
								iconBg="bg-green-500/10"
								icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
								label="Comparecimento"
								value={`${attendanceRate}%`}
								subtitle={`${completed}/${decisive} consultas`}
							/>
						)}
						{paymentRate !== null && (
							<PatientScoreStatItem
								iconBg="bg-primary/10"
								icon={<CreditCard className="h-4 w-4 text-primary" />}
								label="Pagamentos"
								value={`${paymentRate}%`}
								subtitle={`${paid}/${withPayment.length} pagos`}
							/>
						)}
						{canceled > 0 && (
							<PatientScoreStatItem
								iconBg="bg-red-500/10"
								icon={<XCircle className="h-4 w-4 text-red-500" />}
								label="Cancelamentos"
								value={String(canceled)}
								subtitle={`de ${total} consultas`}
							/>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
