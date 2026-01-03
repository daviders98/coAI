import type { Note, MemberRole } from "./NoteTypes";

export function getUserRole(note: Note, userId: string): MemberRole | null {
  return note.members.find((m) => m.userId === userId)?.role ?? null;
}

export function canEdit(role: MemberRole | null) {
  return role === "owner" || role === "editor";
}

export function canDeleteNote(role: MemberRole | null) {
  return role === "owner" || role === "editor";
}
