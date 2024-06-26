import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import toast from "react-hot-toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const onCopy = (text: string, notification?: string) => {
  navigator.clipboard.writeText(text).then((r) => r);
  toast.success(notification || "Copied");
};

export const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const getMediumFont = async () => {
  const response = await fetch(
    new URL("@/assets/fonts/Geist-Medium.ttf", import.meta.url)
  );
  const font = await response.arrayBuffer();
  return font;
};

export const getBoldFont = async () => {
  const response = await fetch(
    new URL("@/assets/fonts/Geist-SemiBold.ttf", import.meta.url)
  );
  const font = await response.arrayBuffer();
  return font;
};
