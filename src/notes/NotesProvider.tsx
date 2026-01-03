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
  }

  function deleteNote(id: string) {
    setNotes((prev) => prev.filter((b) => b.id !== id));
  }
  function renameNote({
    id,
    title,
    description,
  }: {
    id: string;
    title: string;
    description: string;
  }) {
    setNotes((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              title,
              updatedAt: Date.now(),
              description,
            }
          : b,
      ),
    );
  }

  return (
    <NotesContext.Provider value={{ notes, createNote, deleteNote, renameNote }}>
      {children}
    </NotesContext.Provider>
  );
}
