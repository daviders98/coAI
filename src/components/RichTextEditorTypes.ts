import type { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

export type ParagraphElement = {
  type: "paragraph";
  children: CustomText[];
};

export type ListItemElement = {
  type: "list-item";
  children: CustomText[];
};

export type BulletedListElement = {
  type: "bulleted-list";
  children: ListItemElement[];
};

export type NumberedListElement = {
  type: "numbered-list";
  children: ListItemElement[];
};

export type CustomElement =
  | ParagraphElement
  | ListItemElement
  | BulletedListElement
  | NumberedListElement;

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export type Mark = "bold" | "italic" | "underline";
