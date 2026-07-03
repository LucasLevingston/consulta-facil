"use client";

import { useState } from "react";
import type { SystemFeeResponse } from "@/features/billing";
import { useSystemFees, useUpdateSystemFee } from "@/features/billing";

export function useSystemFeesPage() {
	const { data: fees = [], isLoading } = useSystemFees();
	const updateFee = useUpdateSystemFee();
	const [editing, setEditing] = useState<string | null>(null);
	const [fixedFee, setFixedFee] = useState("");
	const [percentageFee, setPercentageFee] = useState("");

	function startEdit(fee: SystemFeeResponse) {
		setEditing(fee.id);
		setFixedFee(String(fee.fixedFee));
		setPercentageFee(String(fee.percentageFee));
	}

	function handleSave(id: string) {
		updateFee.mutate(
			{
				id,
				data: {
					fixedFee: Number(fixedFee),
					percentageFee: Number(percentageFee),
				},
			},
			{ onSuccess: () => setEditing(null) },
		);
	}

	function cancelEdit() {
		setEditing(null);
	}

	return {
		fees,
		isLoading,
		editing,
		fixedFee,
		setFixedFee,
		percentageFee,
		setPercentageFee,
		startEdit,
		cancelEdit,
		handleSave,
		saving: updateFee.isPending,
	};
}
