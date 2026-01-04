import { useEffect, useState } from "react";
import type { Note } from "./NoteTypes";
import { NotesContext } from "./NotesContext";
const STORAGE_KEY = "coai_notes";

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  function createNote({ title, userId, email }: { title: string; userId: string; email: string }) {
    const note: Note = {
      id: crypto.randomUUID(),
      title,
      updatedAt: Date.now(),
      members: [{ userId, role: "owner", email }],
      description: [
        {
          type: "paragraph",
          children: [{ text: "Enter a description" }],
        },
      ],
    };

    setNotes((prev) => [note, ...prev]);
    return note;
  }

  function updateNote({ id, patch }: { id: string; patch: Partial<Note> }) {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, ...patch, updatedAt: Date.now() } : note)),
    );
  }

  function deleteNote(id: string) {
    setNotes((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <NotesContext.Provider
      value={{
        notes,
        createNote,
        deleteNote,
        updateNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}
