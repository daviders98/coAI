import { createContext } from "react";
import type { NotesContextValue } from "./NoteTypes";

export const NotesContext = createContext<NotesContextValue | null>(null);
