import { useState } from "react";
import { AuthContext } from "./AuthContext";
import type { User } from "./AuthTypes";
import type { Note } from "@/notes/NoteTypes";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (email: string) => {
    const notes: Note[] = JSON.parse(localStorage.getItem("coai_notes") || "[]");

    const member = notes.map((note) => note.members.find((m) => m.email === email)).find(Boolean);

    const newUser = { id: member?.userId || crypto.randomUUID(), email };
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}
