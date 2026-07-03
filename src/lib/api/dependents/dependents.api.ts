import { api } from "@/config/api";
import type { CreateDependentInput } from "@/lib/schemas/dependent/create-dependent.schema";
import type { DependentResponse } from "@/lib/schemas/dependent/dependent-response.schema";

export const dependentsApi = {
	getMy: async (): Promise<DependentResponse[]> => {
		const response = await api.get<DependentResponse[]>("/users/me/dependents");
		return response.data;
	},

	create: async (data: CreateDependentInput): Promise<DependentResponse> => {
		const response = await api.post<DependentResponse>(
			"/users/me/dependents",
			data,
		);
		return response.data;
	},

	update: async (
		id: string,
		data: Partial<CreateDependentInput>,
	): Promise<DependentResponse> => {
		const response = await api.put<DependentResponse>(
			`/dependents/${id}`,
			data,
		);
		return response.data;
	},

	remove: async (id: string): Promise<void> => {
		await api.delete(`/dependents/${id}`);
	},
};
