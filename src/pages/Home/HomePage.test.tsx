import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "./HomePage";

import useAuth from "@/auth/useAuth";
import { useNotes } from "@/notes/useNotes";
import type { Note } from "@/notes/NoteTypes";
import type { User } from "@/auth/AuthTypes";

vi.mock("@/auth/useAuth", () => ({
  default: vi.fn(),
}));

vi.mock("@/notes/useNotes", () => ({
  useNotes: vi.fn(),
}));

//@ts-expect-error vi is defined.
const mockedUseAuth = useAuth as vi.MockedFunction<typeof useAuth>;
//@ts-expect-error vi is defined.
const mockedUseNotes = useNotes as vi.MockedFunction<typeof useNotes>;

beforeEach(() => {
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  globalThis.IntersectionObserver =
    MockIntersectionObserver as unknown as typeof IntersectionObserver;
});

const mockLogout = vi.fn();
const mockCreateNote = vi.fn();
const mockDeleteNote = vi.fn();
const mockUpdateNote = vi.fn();

const mockUser: User = {
  id: "user-1",
  email: "test@test.com",
};

const mockNotes: Note[] = [
  {
    id: "note-1",
    title: "First note",
    description: [{ type: "paragraph", children: [{ text: "hello world" }] }],
    updatedAt: Date.now(),
    version: 1,
    versions: [],
    members: [],
  },
];
function renderPage() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );
}

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to /login if user is not authenticated", () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      logout: mockLogout,
    });

    mockedUseNotes.mockReturnValue({
      notes: [],
      createNote: mockCreateNote,
      deleteNote: mockDeleteNote,
      updateNote: mockUpdateNote,
    });

    renderPage();

    expect(screen.queryByText("coAI")).not.toBeInTheDocument();
  });

  it("renders notes for authenticated user", () => {
    mockedUseAuth.mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    });

    mockedUseNotes.mockReturnValue({
      notes: mockNotes,
      createNote: mockCreateNote,
      deleteNote: mockDeleteNote,
      updateNote: mockUpdateNote,
    });

    renderPage();

    expect(screen.getByText("First note")).toBeInTheDocument();
  });

  it("filters notes by search input", () => {
    mockedUseAuth.mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    });

    mockedUseNotes.mockReturnValue({
      notes: mockNotes,
      createNote: mockCreateNote,
      deleteNote: mockDeleteNote,
      updateNote: mockUpdateNote,
    });

    renderPage();

    fireEvent.change(screen.getByPlaceholderText("Search notes..."), {
      target: { value: "no-match" },
    });

    expect(screen.queryByText("First note")).not.toBeInTheDocument();
    expect(screen.getByText("No notes found.")).toBeInTheDocument();
  });

  it("creates a new note when clicking New note", () => {
    mockedUseAuth.mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    });

    mockCreateNote.mockReturnValue({ id: "new-note" });

    mockedUseNotes.mockReturnValue({
      notes: [],
      createNote: mockCreateNote,
      deleteNote: mockDeleteNote,
      updateNote: mockUpdateNote,
    });

    renderPage();

    fireEvent.click(screen.getByLabelText("Add new note"));

    expect(mockCreateNote).toHaveBeenCalledWith({
      title: "",
      userId: mockUser.id,
      email: mockUser.email,
    });
  });

  it("logs out when clicking Logout", () => {
    mockedUseAuth.mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    });

    mockedUseNotes.mockReturnValue({
      notes: [],
      createNote: mockCreateNote,
      deleteNote: mockDeleteNote,
      updateNote: mockUpdateNote,
    });

    renderPage();

    fireEvent.click(screen.getByText("Logout"));
    expect(mockLogout).toHaveBeenCalled();
  });
});
