import { Navigate } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import useAuth from "@/auth/useAuth";
import { useNotes } from "@/notes/useNotes";
import logo from "@/assets/logo.webp";
import NoteCard from "@/notes/NoteCard";
import { Plus } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import type { FocusField } from "@/notes/NoteTypes";
import { NOTES_OFFSET } from "@/notes/NoteConstants";
import { warmupRewordEngine } from "@/ai/rewordEngine";

function HomePage() {
  const { user, logout } = useAuth();
  const { notes, createNote, deleteNote, updateNote } = useNotes();
  const [search, setSearch] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [, setFocusField] = useState<FocusField>();

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(NOTES_OFFSET);

  const filteredNotes = useMemo(() => {
    if (!user) return [];

    return notes.filter((note) => {
      const text =
        note.title +
        " " +
        (note.description?.map((p) => p.children.map((c) => c.text).join("")).join("\n") ?? "");

      return text.toLowerCase().includes(search.toLowerCase());
    });
  }, [notes, search, user]);
  useEffect(() => {
    if (!user) return;
    (() => setVisibleCount(NOTES_OFFSET))();
  }, [user, notes.length]);
  useEffect(() => {
    warmupRewordEngine().catch((e) => {
      console.warn("Local AI warmup failed", e);
    });
  }, []);

  function handleCreateNote() {
    if (user) {
      setSearch("");

      const note = createNote({ title: "", userId: user.id, email: user.email });
      setEditingNoteId(note.id);
    }
  }

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev: number) => Math.min(prev + NOTES_OFFSET, filteredNotes.length));
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0.1,
      },
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [filteredNotes.length]);

  if (!user) return <Navigate to="/login" replace />;
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-center gap-4">
          <img src={logo} alt="App logo" className="h-12 w-auto" />
          <h1 className="text-2xl font-semibold">coAI</h1>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <SearchBar value={search} onChange={setSearch} placeholder="Search notes..." />
          <button
            onClick={handleCreateNote}
            className="hover:bg-primary/90 flex items-center justify-center rounded bg-primary p-2 text-sm text-background transition"
            aria-label="Add new note"
          >
            <Plus className="h-5 w-5" /> New note
          </button>

          <button onClick={logout} className="rounded border px-4 py-2 text-sm">
            Logout
          </button>
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <p className="text-sm text-muted-foreground">No notes found.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {filteredNotes.slice(0, visibleCount).map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              user={user}
              onDelete={deleteNote}
              onUpdate={updateNote}
              isEditOpen={editingNoteId === note.id}
              onEditOpenChange={(open, focus) => {
                setEditingNoteId(open ? note.id : null);
                setFocusField(focus);
              }}
            />
          ))}
        </ul>
      )}

      {<div ref={sentinelRef} />}
    </div>
  );
}

export default HomePage;
