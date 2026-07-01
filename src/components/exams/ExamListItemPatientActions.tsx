"use client";

import { MapPin, Upload, X } from "lucide-react";
import Link from "next/link";
import type { ChangeEvent, RefObject } from "react";
import { Button } from "@/components/ui/button";
import type { ExamRequestResponse } from "@/features/exams";

interface Props {
	exam: ExamRequestResponse;
	cancelling: boolean;
	uploading: boolean;
	fileInputRef: RefObject<HTMLInputElement | null>;
	onCancelScheduling: () => void;
	onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function ExamListItemPatientActions({
	exam,
	cancelling,
	uploading,
	fileInputRef,
	onCancelScheduling,
	onUpload,
}: Props) {
	return (
		<div className="flex flex-wrap gap-2">
			{exam.status === "PENDING" && (
				<Link href={`/laboratories?examId=${exam.id}`}>
					<Button size="sm" variant="default" className="gap-2">
						<MapPin className="h-3.5 w-3.5" />
						Escolher laboratório
					</Button>
				</Link>
			)}
			{exam.status === "SCHEDULED" && exam.schedulingId && (
				<Button
					size="sm"
					variant="destructive"
					className="gap-2"
					disabled={cancelling}
					onClick={onCancelScheduling}
				>
					<X className="h-3.5 w-3.5" />
					{cancelling ? "Cancelando..." : "Cancelar agendamento"}
				</Button>
			)}
			<input
				ref={fileInputRef}
				type="file"
				accept=".pdf,.jpg,.jpeg,.png"
				className="hidden"
				onChange={onUpload}
			/>
			<Button
				size="sm"
				variant="outline"
				className="gap-2"
				disabled={uploading}
				onClick={() => fileInputRef.current?.click()}
			>
				<Upload className="h-3.5 w-3.5" />
				{uploading ? "Enviando..." : "Enviar resultado"}
			</Button>
		</div>
	);
}
