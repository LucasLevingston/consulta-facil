"use client";

import { Camera, Loader2 } from "lucide-react";
import { useRef } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserStore } from "@/features/auth";
import type { AvatarUploadProps } from "./avatar-upload.types";
import { useAvatarUpload } from "./use-avatar-upload";

const sizeMap = {
	sm: {
		avatar: "size-16",
		button: "h-6 w-6",
		icon: "h-3 w-3",
		text: "text-lg",
	},
	md: {
		avatar: "size-20",
		button: "h-7 w-7",
		icon: "h-3.5 w-3.5",
		text: "text-xl",
	},
	lg: {
		avatar: "size-24",
		button: "h-8 w-8",
		icon: "h-4 w-4",
		text: "text-2xl",
	},
};

export function AvatarUpload({ size = "md" }: AvatarUploadProps) {
	const { user } = useUserStore();
	const { uploading, uploadAvatar } = useAvatarUpload();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const s = sizeMap[size];

	const initials = user?.name
		? user.name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.slice(0, 2)
				.toUpperCase()
		: (user?.email?.slice(0, 2).toUpperCase() ?? "CF");

	const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		await uploadAvatar(file);
		e.target.value = "";
	};

	return (
		<div className="relative w-fit">
			<Avatar
				className={`${s.avatar} rounded-2xl border-4 border-card shadow-md`}
			>
				<AvatarImage
					src={user?.imageUrl ?? undefined}
					alt={user?.name ?? "Avatar"}
				/>
				<AvatarFallback
					className={`rounded-2xl bg-primary/15 text-primary font-bold ${s.text}`}
				>
					{uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : initials}
				</AvatarFallback>
			</Avatar>

			<button
				type="button"
				onClick={() => fileInputRef.current?.click()}
				disabled={uploading}
				className={`absolute -bottom-1 -right-1 flex ${s.button} items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow hover:opacity-90 transition-opacity disabled:opacity-50`}
			>
				<Camera className={s.icon} />
			</button>

			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={handleChange}
			/>
		</div>
	);
}
