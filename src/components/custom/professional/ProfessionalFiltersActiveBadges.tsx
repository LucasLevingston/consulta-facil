"use client";

import { MapPin, Search, Stethoscope } from "lucide-react";
import { DAYS } from "@/utils/constants/days-of-week";
import { ALL } from "@/utils/constants/filter-sentinels";
import { FilterBadge } from "./FilterBadge";
import type { useProfessionalFilters } from "./useProfessionalFilters";

interface Props {
	filters: ReturnType<typeof useProfessionalFilters>;
}

export function ProfessionalFiltersActiveBadges({ filters }: Props) {
	return (
		<div className="flex flex-wrap gap-2">
			{filters.name && (
				<FilterBadge
					icon={<Search className="h-3 w-3" />}
					onRemove={() => filters.setName("")}
				>
					&ldquo;{filters.name}&rdquo;
				</FilterBadge>
			)}
			{filters.profession && (
				<FilterBadge onRemove={() => filters.handleProfessionChange(ALL)}>
					{filters.profession}
				</FilterBadge>
			)}
			{filters.specialty && (
				<FilterBadge onRemove={() => filters.setSpecialty("")}>
					{filters.specialty}
				</FilterBadge>
			)}
			{filters.serviceTitle && (
				<FilterBadge
					icon={<Stethoscope className="h-3 w-3" />}
					onRemove={() => filters.setServiceTitle("")}
				>
					{filters.serviceTitle}
				</FilterBadge>
			)}
			{filters.state && (
				<FilterBadge
					icon={<MapPin className="h-3 w-3" />}
					onRemove={() => filters.setState("")}
				>
					{filters.state}
				</FilterBadge>
			)}
			{filters.selectedDays.map((day) => (
				<FilterBadge key={day} onRemove={() => filters.toggleDay(day)}>
					{DAYS.find((d) => d.key === day)?.label ?? day}
				</FilterBadge>
			))}
		</div>
	);
}
