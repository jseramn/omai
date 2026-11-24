import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names. `clsx` handles conditionals; `tailwind-merge` resolves conflicting
 * Tailwind utilities so a consumer `className` override wins (e.g. `cn('px-2', 'px-4')` -> `px-4`).
 * Component classes (`omai-*`) are left untouched.
 *
 * Usage inside components: `className={cn('omai-button', className)}` — component class FIRST,
 * consumer `className` LAST.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export type { ClassValue };
