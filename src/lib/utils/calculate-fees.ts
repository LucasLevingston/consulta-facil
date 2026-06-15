import type {
	FeeConfig,
	PaymentMethodBreakdown,
} from "@/lib/schemas/fees/fee-calculation.schema";

export type FeePaymentMethod =
	| "PIX"
	| "CREDIT_CARD"
	| "DEBIT_CARD"
	| "CASH"
	| "MERCADOPAGO";

const MP_RATES: Record<FeePaymentMethod, (cfg: FeeConfig) => number> = {
	PIX: (cfg) => cfg.pixFeeRate,
	CREDIT_CARD: (cfg) => cfg.creditCardFeeRate,
	MERCADOPAGO: (cfg) => cfg.creditCardFeeRate,
	DEBIT_CARD: (cfg) => cfg.debitFeeRate,
	CASH: () => 0,
};

export const PAYMENT_METHOD_LABELS: Record<FeePaymentMethod, string> = {
	PIX: "PIX",
	CREDIT_CARD: "Cartão de crédito",
	DEBIT_CARD: "Cartão de débito",
	CASH: "Dinheiro",
	MERCADOPAGO: "MercadoPago",
};

const ALL_METHODS: FeePaymentMethod[] = [
	"PIX",
	"CREDIT_CARD",
	"DEBIT_CARD",
	"CASH",
	"MERCADOPAGO",
];

function round2(n: number) {
	return Math.round(n * 100) / 100;
}

function breakdown(
	base: number,
	method: FeePaymentMethod,
	platformRate: number,
	cfg: FeeConfig,
	profAbsorbs: boolean,
): PaymentMethodBreakdown {
	const mpRate = MP_RATES[method](cfg);
	let gross: number;
	let net: number;
	let mpFee: number;
	let platformFee: number;

	if (profAbsorbs) {
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
		paymentMethod: method,
		mpFeeRate: mpRate,
		mpFeeAmount: mpFee,
		platformFeeAmount: platformFee,
		totalFees: round2(mpFee + platformFee),
		professionalReceives: net,
		patientPays: gross,
	};
}

export function calculateFees(
	amount: number,
	method: FeePaymentMethod,
	cfg: FeeConfig,
	profAbsorbs = true,
) {
	const platformRate = cfg.platformFeeRate;
	const selected = breakdown(amount, method, platformRate, cfg, profAbsorbs);
	const base = profAbsorbs ? amount : amount;
	const comparison = ALL_METHODS.map((m) =>
		breakdown(base, m, platformRate, cfg, profAbsorbs),
	);
	return { selected, comparison };
}
