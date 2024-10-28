import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function splitByArray(source: string, patterns: string[]) {
  const pattern = patterns.find((pattern) => source.includes(pattern))
  if (pattern) return { pattern, values: source.split(pattern) }
  return { pattern: patterns[0], values: ['', ''] }
}
