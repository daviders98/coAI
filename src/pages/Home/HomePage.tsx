import { Navigate } from "react-router-dom";
import useAuth from "@/auth/useAuth";
import { useNotes } from "@/notes/useNotes";
import logo from "@/assets/logo.webp";
import NoteCard from "@/notes/NoteCard";
import { Plus } from "lucide-react";

function HomePage() {
  const { user, logout } = useAuth();
  const { notes, createNote, deleteNote, renameNote } = useNotes();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <img src={logo} alt="App logo" className="h-12 w-auto" />

        <h1 className="text-2xl font-semibold">All Notes</h1>

        <div className="flex gap-2">
          <button
            onClick={() => createNote({ title: "New note", userId: user.id, email: user.email })}
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

      {notes.length === 0 && <p className="text-sm text-muted-foreground">No notes yet.</p>}
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            userId={user.id}
            onDelete={deleteNote}
            onRename={renameNote}
          />
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
