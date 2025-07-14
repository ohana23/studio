import clsx from "clsx"

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent",
        className
      )}
    />
  )
}
