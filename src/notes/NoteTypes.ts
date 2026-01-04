export type MemberRole = "owner" | "editor" | "viewer";

export type NoteMember = {
  userId: string;
  role: MemberRole;
  email: string;
};

export type DescriptionChildren = {
  text: string;
};
export type NoteDescription = {
  type: string;
  children: DescriptionChildren[];
};
export type Note = {
  id: string;
  title: string;
  updatedAt: number;
  members: NoteMember[];
  description: NoteDescription[];
};

export type NoteCardProps = {
  note: Note;
  userId: string;
  onDelete: (id: string) => void;
  onUpdate: (update: { id: string; patch: Partial<Note> }) => void;
  isEditOpen: boolean;
  onEditOpenChange?: (open: boolean) => void;
};

export type NotesContextValue = {
  notes: Note[];
  createNote: ({ title, userId, email }: { title: string; userId: string; email: string }) => Note;
  deleteNote: (id: string) => void;
  updateNote: ({ id, patch }: { id: string; patch: Partial<Note> }) => void;
};
