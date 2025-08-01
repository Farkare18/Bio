import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date))
}

export function generateChatTitle(message: string): string {
  // Take first 50 characters and add ellipsis if longer
  const title = message.trim().slice(0, 50)
  return title.length < message.trim().length ? `${title}...` : title
}