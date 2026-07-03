import { api } from "@/config/api";
import type { CreateDependentInput } from "@/lib/schemas/dependent/create-dependent.schema";
import type { DependentResponse } from "@/lib/schemas/dependent/dependent-response.schema";

export const dependentsRepository = {
	getMy: async (): Promise<DependentResponse[]> => {
		const res = await api.get<DependentResponse[]>("/users/me/dependents");
		return res.data;
	},

	create: async (data: CreateDependentInput): Promise<DependentResponse> => {
		const res = await api.post<DependentResponse>("/users/me/dependents", data);
		return res.data;
	},

	update: async (
		id: string,
		data: Partial<CreateDependentInput>,
	): Promise<DependentResponse> => {
		const res = await api.put<DependentResponse>(`/dependents/${id}`, data);
		return res.data;
	},

	remove: async (id: string): Promise<void> => {
		await api.delete(`/dependents/${id}`);
	},
};
