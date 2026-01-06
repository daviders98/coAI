import type { NoteDescription } from "./NoteTypes";

export const ModalFocusField = {
  TITLE: "title",
  DESCRIPTION: "description",
};

export const EMPTY_EDITOR_VALUE: NoteDescription[] = [
  { type: "paragraph", children: [{ text: "" }] },
];

export const STORAGE_KEY = "coai_notes";

export const NOTES_OFFSET = 20;
