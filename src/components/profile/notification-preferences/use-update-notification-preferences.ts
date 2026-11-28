import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUserStore } from "@/features/auth";
import { usersRepository } from "@/features/users";
import type { UpdateNotificationPreferences } from "@/lib/schemas/user/notification-preferences.schema";
import { buildSuccessMessage } from "./build-success-message";

export function useUpdateNotificationPreferences() {
	const { loadUser } = useUserStore();

	return useMutation({
		mutationFn: (preferences: UpdateNotificationPreferences) =>
			usersRepository.updateNotificationPreferences(preferences),
		onSuccess: async (_user, preferences) => {
			await loadUser();
			toast.success(buildSuccessMessage(preferences));
		},
		onError: () => {
			toast.error("Não foi possível salvar sua preferência. Tente novamente.");
		},
	});
}
