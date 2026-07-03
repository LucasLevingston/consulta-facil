import { api } from "@/config/api";
import type { FeeConfig } from "@/lib/schemas/fees/fee-calculation.schema";

export const feesApi = {
	getConfig: async (): Promise<FeeConfig> => {
		const response = await api.get<FeeConfig>("/fees/config");
		return response.data;
	},
};
