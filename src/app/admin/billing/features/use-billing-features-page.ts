"use client";

import { useState } from "react";
import { useCreateFeature } from "./use-create-feature";
import { useDeleteFeature } from "./use-delete-feature";
import { useFeatures } from "./use-features";

export function useBillingFeaturesPage() {
	const { data: features = [], isLoading } = useFeatures();
	const createFeature = useCreateFeature();
	const deleteFeature = useDeleteFeature();

	const [newKey, setNewKey] = useState("");
	const [newName, setNewName] = useState("");

	function handleCreate() {
		if (!newKey || !newName) return;
		createFeature.mutate(
			{ key: newKey, name: newName },
			{
				onSuccess: () => {
					setNewKey("");
					setNewName("");
				},
			},
		);
	}

	function handleDelete(id: string) {
		deleteFeature.mutate(id);
	}

	return {
		features,
		isLoading,
		newKey,
		setNewKey,
		newName,
		setNewName,
		handleCreate,
		handleDelete,
		creating: createFeature.isPending,
		deleting: deleteFeature.isPending,
	};
}
