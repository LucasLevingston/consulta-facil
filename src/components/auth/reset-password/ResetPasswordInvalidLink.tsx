import Link from "next/link";

export function ResetPasswordInvalidLink() {
	return (
		<div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
			<div className="w-full max-w-sm space-y-6 text-center">
				<h2 className="text-2xl font-bold text-foreground">Link inválido</h2>
				<p className="text-sm text-muted-foreground">
					Este link de redefinição é inválido ou expirou.
				</p>
				<Link
					href="/auth/forgot-password"
					className="text-primary font-medium hover:underline text-sm"
				>
					Solicitar novo link
				</Link>
			</div>
		</div>
	);
}
