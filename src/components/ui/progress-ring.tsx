import { cn } from '@/lib/cn'

type Props = {
  value: number
  size?: number
  stroke?: number
  className?: string
}

export function ProgressRing({ value, size = 120, stroke = 10, className }: Props) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c * (1 - Math.min(1, Math.max(0, value)))

  return (
    <svg
      width={size}
      height={size}
      className={cn('rotate-[-90deg]', className)}
      aria-hidden
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="currentColor"
        strokeWidth={stroke}
        className="text-zinc-200 dark:text-zinc-800"
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="currentColor"
        strokeWidth={stroke}
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-[var(--color-accent)] transition-[stroke-dashoffset] duration-500"
        fill="none"
      />
    </svg>
  )
}
