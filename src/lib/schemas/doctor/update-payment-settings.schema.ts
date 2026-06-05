import { z } from "zod";
import { paymentMethodSchema } from "./payment-method.schema";
import { paymentTimingSchema } from "./payment-timing.schema";

export const updatePaymentSettingsSchema = z.object({
	paymentTiming: paymentTimingSchema,
	acceptedPaymentMethods: z
		.array(paymentMethodSchema)
		.min(1, "Selecione ao menos um método de pagamento"),
});

export type UpdatePaymentSettingsInput = z.infer<
	typeof updatePaymentSettingsSchema
>;
