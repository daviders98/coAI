import type { Note, MemberRole } from "./NoteTypes";

export function getUserRole(note: Note, userId?: string, email?: string) {
  let member;
  if (userId) {
    member = note.members.find((m) => m.userId === userId);
  }
  if (!member && email) {
    member = note.members.find((m) => m.email === email);
  }
  return member?.role ?? "viewer";
}

export function canEdit(role: MemberRole | null) {
  return role === "owner" || role === "editor";
}

export function canDeleteNote(role: MemberRole | null) {
  return role === "owner" || role === "editor";
}
