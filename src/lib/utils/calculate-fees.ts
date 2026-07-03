import type {
	FeeConfig,
	PaymentMethodBreakdown,
} from "@/lib/schemas/fees/fee-calculation.schema";
import type { FeePaymentMethod } from "@/lib/types/fee-payment-method";

export type { FeePaymentMethod } from "@/lib/types/fee-payment-method";

const MP_RATES: Record<FeePaymentMethod, (cfg: FeeConfig) => number> = {
	PIX: (cfg) => cfg.pixFeeRate,
	CREDIT_CARD: (cfg) => cfg.creditCardFeeRate,
	MERCADOPAGO: (cfg) => cfg.creditCardFeeRate,
	DEBIT_CARD: (cfg) => cfg.debitFeeRate,
	CASH: () => 0,
};

const ALL_METHODS: FeePaymentMethod[] = [
	"PIX",
	"CREDIT_CARD",
	"DEBIT_CARD",
	"CASH",
	"MERCADOPAGO",
];

export function calculateFees(
	amount: number,
	method: FeePaymentMethod,
	cfg: FeeConfig,
	profAbsorbs = true,
) {
	function round2(n: number) {
		return Math.round(n * 100) / 100;
	}

	function breakdown(
		base: number,
		m: FeePaymentMethod,
		platformRate: number,
		config: FeeConfig,
		absorbs: boolean,
	): PaymentMethodBreakdown {
		const mpRate = MP_RATES[m](config);
		let gross: number;
		let net: number;
		let mpFee: number;
		let platformFee: number;

		if (absorbs) {
			gross = base;
			mpFee = round2(gross * mpRate);
			platformFee = round2(gross * platformRate);
			net = round2(gross - mpFee - platformFee);
		} else {
			net = base;
			const divisor = 1 - mpRate - platformRate;
			gross = round2(net / divisor);
			mpFee = round2(gross * mpRate);
			platformFee = round2(gross * platformRate);
		}

		return {
			paymentMethod: m,
			mpFeeRate: mpRate,
			mpFeeAmount: mpFee,
			platformFeeAmount: platformFee,
			totalFees: round2(mpFee + platformFee),
			professionalReceives: net,
			patientPays: gross,
		};
	}

	const platformRate = cfg.platformFeeRate;
	const selected = breakdown(amount, method, platformRate, cfg, profAbsorbs);
	const comparison = ALL_METHODS.map((m) =>
		breakdown(amount, m, platformRate, cfg, profAbsorbs),
	);
	return { selected, comparison };
}
