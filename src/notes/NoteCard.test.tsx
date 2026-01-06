import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import NoteCard from "./NoteCard";
import type { Note } from "./NoteTypes";
import { ModalFocusField } from "./NoteConstants";

vi.mock("./NotePermissions", () => ({
  getUserRole: vi.fn(),
  canDeleteNote: vi.fn(),
}));

vi.mock("./NoteEditModal", () => ({
  NoteEditModal: ({ open }: { open: boolean }) => (open ? <div>Edit Modal</div> : null),
}));

vi.mock("./NoteMembersModal", () => ({
  NoteMembersModal: ({ open }: { open: boolean }) => (open ? <div>Members Modal</div> : null),
}));

// slate util
vi.mock("@/lib/utils", () => ({
  slateToPlainText: vi.fn(() => "Plain description"),
  cn: vi.fn(() => "Plain description"),
}));

import { getUserRole, canDeleteNote } from "./NotePermissions";

const note: Note = {
  id: "note-1",
  title: "Test Note",
  description: [{ type: "paragraph", children: [{ text: "hello" }] }],
  updatedAt: Date.now(),
  version: 1,
  versions: [],
  members: [],
};

const onDelete = vi.fn();
const onUpdate = vi.fn();
const onEditOpenChange = vi.fn();

const user = {
  id: "user-1",
  email: "user@example.com",
  name: "Test User",
};

function renderNote(overrides = {}) {
  return render(
    <ul>
      <NoteCard
        note={note}
        user={user}
        onDelete={onDelete}
        onUpdate={onUpdate}
        onEditOpenChange={onEditOpenChange}
        {...overrides}
        isEditOpen={true}
      />
    </ul>,
  );
}

describe("NoteCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders note title and description", () => {
    vi.mocked(getUserRole).mockReturnValue("owner");
    vi.mocked(canDeleteNote).mockReturnValue(true);

    renderNote();

    expect(screen.getByText("Test Note")).toBeInTheDocument();
    expect(screen.getByText("Plain description")).toBeInTheDocument();
  });

  it("opens edit modal when clicking title", () => {
    vi.mocked(getUserRole).mockReturnValue("owner");
    vi.mocked(canDeleteNote).mockReturnValue(true);

    renderNote();

    fireEvent.click(screen.getByText("Test Note"));

    expect(onEditOpenChange).toHaveBeenCalledWith(true, ModalFocusField.TITLE);
  });

  it("opens edit modal when clicking description", () => {
    vi.mocked(getUserRole).mockReturnValue("editor");
    vi.mocked(canDeleteNote).mockReturnValue(false);

    renderNote();

    fireEvent.click(screen.getByText("Plain description"));

    expect(onEditOpenChange).toHaveBeenCalledWith(true, ModalFocusField.DESCRIPTION);
  });

  it("shows delete button only if user can delete", () => {
    vi.mocked(getUserRole).mockReturnValue("viewer");
    vi.mocked(canDeleteNote).mockReturnValue(false);

    renderNote();

    expect(screen.queryByLabelText("Delete note")).not.toBeInTheDocument();
  });

  it("calls onDelete when clicking delete", () => {
    vi.mocked(getUserRole).mockReturnValue("owner");
    vi.mocked(canDeleteNote).mockReturnValue(true);

    renderNote();

    fireEvent.click(screen.getByLabelText("Delete note"));

    expect(onDelete).toHaveBeenCalledWith(note.id);
  });

  it("opens members modal when clicking members button", () => {
    vi.mocked(getUserRole).mockReturnValue("owner");
    vi.mocked(canDeleteNote).mockReturnValue(true);

    renderNote();

    fireEvent.click(screen.getByLabelText("View members"));

    expect(screen.getByText("Members Modal")).toBeInTheDocument();
  });
});
