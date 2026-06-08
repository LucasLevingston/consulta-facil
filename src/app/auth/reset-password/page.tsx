import { Suspense } from "react";
import { ResetPasswordContent } from "@/components/auth/reset-password/ResetPasswordContent";

export default function ResetPasswordPage() {
	return (
		<Suspense>
			<ResetPasswordContent />
		</Suspense>
	);
}
