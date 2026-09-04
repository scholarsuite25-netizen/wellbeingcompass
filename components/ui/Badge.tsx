import { cn } from "@/lib/utils";
export function Badge({ children, variant="default", className }: { children: React.ReactNode; variant?: "default"|"accent"|"success"|"muted"; className?: string }) {
  const styles = {
    default: "bg-brand-50 text-brand-700 border-brand-200",
    accent: "bg-accent-100 text-ink dark:text-[#17212B] border-accent-200",
    success: "bg-green-50 text-green-800 border-green-200",
    muted: "bg-gray-100 text-gray-700 border-gray-200",
  }[variant];
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide", styles, className)}>{children}</span>;
}
