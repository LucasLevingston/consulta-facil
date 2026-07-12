"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { type UpdateCouponData, updateCouponSchema } from "@/features/billing";
import type { EditCouponDialogProps } from "./EditCouponDialog.types";
import { EditCouponForm } from "./EditCouponForm";
import { useAdminUpdateCoupon } from "./use-admin-update-coupon";

export function EditCouponDialog({ coupon }: EditCouponDialogProps) {
	const [open, setOpen] = useState(false);
	const update = useAdminUpdateCoupon();

	const form = useForm<UpdateCouponData>({
		resolver: zodResolver(updateCouponSchema),
		defaultValues: {
			description: coupon.description ?? "",
			status: coupon.status,
			maxUses: coupon.maxUses ?? undefined,
			expiresAt: coupon.expiresAt ? coupon.expiresAt.split("T")[0] : "",
		},
	});

	function onSubmit(data: UpdateCouponData) {
		update.mutate({ id: coupon.id, data }, { onSuccess: () => setOpen(false) });
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost" size="sm">
					Editar
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Editar Cupom — {coupon.code}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<EditCouponForm
						control={form.control}
						onSubmit={form.handleSubmit(onSubmit)}
						isPending={update.isPending}
					/>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
