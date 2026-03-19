import { cn } from "@/lib/utils"

export function ColoredText({
  children,
  className,
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("text-[#F9930C] font-bold opacity-100", className)}>
      {children}
    </span>
  )
}
