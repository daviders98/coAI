import { useState } from "react";
import { AuthContext } from "./AuthContext";
import type { User } from "./AuthTypes";
import type { Note } from "@/notes/NoteTypes";
import { STORAGE_KEY } from "@/notes/NoteConstants";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (email: string) => {
    let notes: Note[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    const existingMember = notes
      .map((note) => note.members.find((m) => m.email === email))
      .find(Boolean);

    const newUser: User = { id: existingMember?.userId || crypto.randomUUID(), email };

    if (!existingMember) {
      const defaultNotes: Note[] = Array.from({ length: 50 }, (_, i) => {
        const id = crypto.randomUUID();
        const now = Date.now();
        return {
          id,
          title: `Note ${i + 1}`,
          description: [{ type: "paragraph", children: [{ text: `Description ${i + 1}` }] }],
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
              description: [{ type: "paragraph", children: [{ text: `Description ${i + 1}` }] }],
              updatedAt: now,
            },
          ],
          members: [{ userId: newUser.id, role: "owner", email: newUser.email }],
        };
      });

      notes = [...notes, ...defaultNotes];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }

    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);

    // force update notes
    window.dispatchEvent(new Event("storage"));
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}
