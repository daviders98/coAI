import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slateToPlainText(value: any): string {
  if (!Array.isArray(value)) return "";

  return value.map((node) => node.children?.map((child: any) => child.text).join("")).join("\n");
}
