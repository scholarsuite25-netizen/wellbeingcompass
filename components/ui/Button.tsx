import { cn } from "@/lib/utils";
export function Button({ children, variant="primary", size="md", className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary"|"secondary"|"ghost"; size?: "sm"|"md"|"lg" }) {
  const v = {
    primary: "bg-brand-500 text-white hover:bg-brand-600 focus-visible:ring-brand-500 shadow-sm",
    secondary: "bg-white text-brand-700 border border-brand-200 hover:bg-brand-50",
    ghost: "bg-transparent text-brand-700 hover:bg-brand-50",
  }[variant];
  const s = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" }[size];
  return <button className={cn("inline-flex items-center justify-center rounded-full font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50", v, s, className)} {...props}>{children}</button>;
}
