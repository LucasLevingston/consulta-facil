"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useConversations } from "@/features/messaging";

export function useMessagesPage() {
	const searchParams = useSearchParams();
	const { data: conversations } = useConversations();
	const [selectedId, setSelectedId] = useState<string | null>(
		searchParams.get("c"),
	);
	const [mobileShowThread, setMobileShowThread] = useState(false);

	const selected = conversations.find((c) => c.id === selectedId);

	useEffect(() => {
		const c = searchParams.get("c");
		if (c) {
			setSelectedId(c);
			setMobileShowThread(true);
		}
	}, [searchParams]);

	function handleSelect(id: string) {
		setSelectedId(id);
		setMobileShowThread(true);
	}

	return {
		conversations,
		selected,
		selectedId,
		mobileShowThread,
		setMobileShowThread,
		handleSelect,
	};
}
