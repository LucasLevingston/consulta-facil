"use client";

import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/config/api";
import { useUserStore } from "@/store/useUserStore";

export function useAvatarUpload() {
	const { loadUser } = useUserStore();
	const [uploading, setUploading] = useState(false);

	async function uploadAvatar(file: File) {
		if (!file.type.startsWith("image/")) {
			toast.error("Selecione uma imagem válida.");
			return;
		}

		const formData = new FormData();
		formData.append("file", file);
		setUploading(true);
		try {
			await api.post("/users/me/avatar", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			await loadUser();
			toast.success("Foto atualizada com sucesso!");
		} catch {
			toast.error("Erro ao enviar a foto.");
		} finally {
			setUploading(false);
		}
	}

	return { uploading, uploadAvatar };
}
