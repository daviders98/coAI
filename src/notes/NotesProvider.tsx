import { useEffect, useState } from "react";
import type { Note } from "./NoteTypes";
import { NotesContext } from "./NotesContext";
import { STORAGE_KEY } from "./NoteConstants";
import type { User } from "@/auth/AuthTypes";

export function NotesProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User | null;
}) {
  const [notes, setNotes] = useState<Note[]>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (!user) return;

    const storedNotes = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as Note[];
    const hasNotes = storedNotes.some((n) => n.members.some((m) => m.userId === user.id));

    if (!hasNotes) {
      const defaultNotes: Note[] = Array.from({ length: 50 }, (_, i) => {
        const id = crypto.randomUUID();
        const now = Date.now();
        return {
          id,
          title: `Note ${i + 1}`,
          description: [
            {
              type: "paragraph",
              children: [
                {
                  text: `Meeting notes from today, talked about roadmap, but nothing was decided yet. Follow up later.`,
                },
              ],
            },
          ],
          updatedAt: now,
          version: 2,
          versions: [
            {
              version: 1,
              title: "",
              description: [{ type: "paragraph", children: [{ text: "" }] }],
              updatedAt: now - 1,
            },
            {
              version: 2,
              title: `Note ${i + 1}`,
              description: [
                {
                  type: "paragraph",
                  children: [
                    {
                      text: `Meeting notes from today, talked about roadmap, but nothing was decided yet. Follow up later.`,
                    },
                  ],
                },
              ],
              updatedAt: now,
            },
          ],
          members: [{ userId: user.id, role: "owner", email: user.email }],
        };
      });

      const updatedNotes = [...storedNotes, ...defaultNotes];
      (() => setNotes(updatedNotes))();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
    }
  }, [user]);

  function createNote({ title, userId, email }: { title: string; userId: string; email: string }) {
    const now = Date.now();
    const note: Note = {
      id: crypto.randomUUID(),
      title,
      description: [{ type: "paragraph", children: [{ text: "" }] }],
      updatedAt: now,
      version: 1,
      versions: [
        {
          version: 1,
          title,
          description: [{ type: "paragraph", children: [{ text: "" }] }],
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
    <NotesContext.Provider value={{ notes, createNote, updateNote, deleteNote }}>
      {children}
    </NotesContext.Provider>
  );
}
