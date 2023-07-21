import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import toast from "react-hot-toast";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const onCopy = (text: string, notification?: string) => {
  navigator.clipboard.writeText(text).then(r => r);
  toast.success(notification || "Copied");
}
