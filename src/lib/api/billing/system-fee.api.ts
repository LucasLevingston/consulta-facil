import { api } from "@/config/api";
import type {
	SystemFeeResponse,
	UpdateSystemFeeValues,
} from "@/lib/schemas/billing/system-fee.schema";

export const systemFeeApi = {
	listAll: async (): Promise<SystemFeeResponse[]> => {
		const res = await api.get<SystemFeeResponse[]>(
			"/admin/billing/system-fees",
		);
		return res.data;
	},

	getById: async (id: string): Promise<SystemFeeResponse> => {
		const res = await api.get<SystemFeeResponse>(
			`/admin/billing/system-fees/${id}`,
		);
		return res.data;
	},

	update: async (
		id: string,
		data: UpdateSystemFeeValues,
	): Promise<SystemFeeResponse> => {
		const res = await api.patch<SystemFeeResponse>(
			`/admin/billing/system-fees/${id}`,
			data,
		);
		return res.data;
	},
};
