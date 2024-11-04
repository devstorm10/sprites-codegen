import { twMerge } from 'tailwind-merge'
import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAgentUrl(projectId: string, id: string) {
  return `/edit/${projectId}/${id}`
}
