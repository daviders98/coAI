import { useEffect, useState } from "react";
import type { Note } from "./NoteTypes";
import { NotesContext } from "./NotesContext";
import { STORAGE_KEY } from "./NoteConstants";

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY) return;
      if (!e.newValue) return;

      try {
        const incoming = JSON.parse(e.newValue) as Note[];
        setNotes(incoming);
      } catch (e) {
        console.log(e);
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);
  function createNote({ title, userId, email }: { title: string; userId: string; email: string }) {
    const now = Date.now();

    const note: Note = {
      id: crypto.randomUUID(),
      title,
      description: [
        {
          type: "paragraph",
          children: [{ text: "" }],
        },
      ],
      updatedAt: now,
      version: 1,
      versions: [
        {
          version: 1,
          title,
          description: [
            {
              type: "paragraph",
              children: [{ text: "" }],
            },
          ],
          updatedAt: now,
        },
      ],
      members: [{ userId, role: "owner", email }],
    };

    setNotes((prev) => [note, ...prev]);
    return note;
  }

  function updateNote({ id, patch }: { id: string; patch: Partial<Note> }) {
    setNotes((prev) =>
      prev.map((note) => {
        if (note.id !== id) return note;

        const now = Date.now();
        const currentVersion = patch.version ?? note.version;
        const nextVersion = currentVersion + 1;

        return {
          ...note,
          ...patch,
          updatedAt: now,
          version: nextVersion,
          versions: [
            ...note.versions,
            {
              version: nextVersion,
              title: patch.title ?? note.title,
              description: patch.description ?? note.description,
              updatedAt: now,
            },
          ],
        };
      }),
    );
  }
  function deleteNote(id: string) {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  }

  return (
    <NotesContext.Provider
      value={{
        notes,
        createNote,
        updateNote,
        deleteNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}
