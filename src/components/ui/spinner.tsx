import { cn } from "cn";

function SpinLoader({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-10 w-10 animate-spin rounded-full border-2 border-primary/30 border-t-primary",
        className
      )}
    />
  );
}

export { SpinLoader };