"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { DayKey } from "@/utils/constants/days-of-week";
import { ALL } from "@/utils/constants/filter-sentinels";
import {
	PROFESSION_SPECIALTIES,
	specialties,
} from "@/utils/constants/profession-specialties";

export function useProfessionalFilters() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [name, setName] = useState(searchParams.get("name") ?? "");
	const [profession, setProfession] = useState(
		searchParams.get("profession") ?? "",
	);
	const [specialty, setSpecialty] = useState(
		searchParams.get("specialty") ?? "",
	);
	const [serviceTitle, setServiceTitle] = useState(
		searchParams.get("serviceTitle") ?? "",
	);
	const [state, setState] = useState(searchParams.get("state") ?? "");
	const [selectedDays, setSelectedDays] = useState<DayKey[]>(
		(searchParams.get("days")?.split(",").filter(Boolean) ?? []) as DayKey[],
	);
	const [expanded, setExpanded] = useState(
		!!(serviceTitle || state || selectedDays.length),
	);

	const availableSpecialties = profession
		? (PROFESSION_SPECIALTIES[profession] ?? [])
		: specialties;
	const isFirstRender = useRef(true);
	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}
		const params = new URLSearchParams();
		if (name) params.set("name", name);
		if (profession) params.set("profession", profession);
		if (specialty) params.set("specialty", specialty);
		if (serviceTitle) params.set("serviceTitle", serviceTitle);
		if (state) params.set("state", state);
		if (selectedDays.length) params.set("days", selectedDays.join(","));
		params.set("page", "0");
		router.replace(`/professionals?${params.toString()}`);
	}, [name, profession, specialty, serviceTitle, state, selectedDays, router]);

	function handleProfessionChange(val: string) {
		setProfession(val === ALL ? "" : val);
		setSpecialty("");
	}

	function toggleDay(day: DayKey) {
		setSelectedDays((prev) =>
			prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
		);
	}

	function clearAll() {
		setName("");
		setProfession("");
		setSpecialty("");
		setServiceTitle("");
		setState("");
		setSelectedDays([]);
	}

	const advancedCount = [serviceTitle, state, selectedDays.length > 0].filter(
		Boolean,
	).length;
	const totalActive =
		[name, profession, specialty].filter(Boolean).length + advancedCount;

	return {
		name,
		setName,
		profession,
		specialty,
		setSpecialty,
		serviceTitle,
		setServiceTitle,
		state,
		setState,
		selectedDays,
		expanded,
		setExpanded,
		availableSpecialties,
		advancedCount,
		totalActive,
		handleProfessionChange,
		toggleDay,
		clearAll,
	};
}
