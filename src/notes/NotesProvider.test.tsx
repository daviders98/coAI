import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { NotesProvider } from "./NotesProvider";
import { NotesContext } from "./NotesContext";
import { STORAGE_KEY } from "./NoteConstants";
import type { Note } from "./NoteTypes";
import React from "react";

function useNoteTest() {
  const ctx = React.useContext(NotesContext);
  if (!ctx) {
    throw new Error("NotesContext not found");
  }
  return ctx;
}

function renderNotesHook() {
  const fakeUser = { id: "user-1", email: "test@example.com" };
  return renderHook(() => useNoteTest(), {
    wrapper: ({ children }) => <NotesProvider user={fakeUser}>{children}</NotesProvider>,
  });
}

describe("NotesProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("initializes notes from localStorage", () => {
    const storedNotes: Note[] = [
      {
        id: "1",
        title: "Stored note",
        description: [{ type: "paragraph", children: [{ text: "hello" }] }],
        updatedAt: 1,
        version: 1,
        versions: [],
        members: [],
      },
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedNotes));

    const { result } = renderNotesHook();

    expect(result.current.notes).toHaveLength(51);
    expect(result.current.notes[0].title).toBe("Stored note");
  });

  it("creates a new note with owner", () => {
    const { result } = renderNotesHook();

    act(() => {
      result.current.createNote({
        title: "New Note",
        userId: "user-1",
        email: "test@example.com",
      });
    });

    expect(result.current.notes).toHaveLength(51);
    expect(result.current.notes[0].title).toBe("New Note");
    expect(result.current.notes[0].members[0]).toMatchObject({
      userId: "user-1",
      role: "owner",
      email: "test@example.com",
    });
  });

  it("updates a note and increments version", () => {
    const { result } = renderNotesHook();

    let noteId: string;

    act(() => {
      const note = result.current.createNote({
        title: "Initial",
        userId: "user-1",
        email: "test@example.com",
      });
      noteId = note.id;
    });

    act(() => {
      result.current.updateNote({
        id: noteId!,
        patch: { title: "Updated" },
      });
    });

    const updated = result.current.notes[0];
    expect(updated.title).toBe("Updated");
    expect(updated.version).toBe(2);
    expect(updated.versions).toHaveLength(2);
  });

  it("deletes a note", () => {
    const { result } = renderNotesHook();

    let noteId: string;

    act(() => {
      const note = result.current.createNote({
        title: "To delete",
        userId: "user-1",
        email: "test@example.com",
      });
      noteId = note.id;
    });

    act(() => {
      result.current.deleteNote(noteId!);
    });

    expect(result.current.notes).toHaveLength(50);
  });

  it("persists notes to localStorage", () => {
    const spy = vi.spyOn(localStorage.__proto__, "setItem");

    const { result } = renderNotesHook();

    act(() => {
      result.current.createNote({
        title: "Persisted",
        userId: "user-1",
        email: "test@example.com",
      });
    });

    expect(spy).toHaveBeenCalledWith(STORAGE_KEY, expect.stringContaining("Persisted"));
  });
});
