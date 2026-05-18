import { cn } from "@/lib/utils"

export const LogoContent = (props: any) => {
   return(
      <p
				{...props}
				className={cn("text-primary font-bold text-2xl", props.className)}
			>
				Consulta Fácil
			</p>
   )}