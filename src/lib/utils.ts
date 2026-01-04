import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Text } from "slate";
import type { NoteDescription } from "@/notes/NoteTypes";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slateToPlainText(value: NoteDescription[]): string {
  return value
    .map((node) => {
      if ("children" in node) {
        return node.children
          .filter((child): child is Text => "text" in child)
          .map((child) => child.text)
          .join("");
      }
      return "";
    })
    .join("\n");
}
