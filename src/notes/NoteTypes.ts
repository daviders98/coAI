export type MemberRole = "owner" | "editor" | "viewer";

export type NoteMember = {
  userId: string;
  role: MemberRole;
  email: string;
};

export type Note = {
  id: string;
  title: string;
  updatedAt: number;
  members: NoteMember[];
  description: string;
};

export type NoteCardProps = {
  note: Note;
  userId: string;
  onDelete: (id: string) => void;
  onRename: ({
    id,
    title,
    description,
  }: {
    id: string;
    title: string;
    description: string;
  }) => void;
};

export type NotesContextValue = {
  notes: Note[];
  createNote: ({ title, userId, email }: { title: string; userId: string; email: string }) => void;
  deleteNote: (id: string) => void;
  renameNote: ({
    id,
    title,
    description,
  }: {
    id: string;
    title: string;
    description: string;
  }) => void;
};
