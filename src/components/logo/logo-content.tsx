import { cn } from "@/lib/utils"

export const LogoContent = (props: any) => {
   return(
      <p
				{...props}
className={cn(
	"bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold text-2xl",
	props.className
)}			>
				Consulta Fácil
			</p>
   )}