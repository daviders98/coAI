import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { AuthProvider } from "./AuthProvider";
import { AuthContext } from "./AuthContext";
import { STORAGE_KEY } from "@/notes/NoteConstants";
import type { Note } from "@/notes/NoteTypes";
import type { User } from "./AuthTypes";

function useAuthTest() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("AuthContext not found");
  }
  return ctx;
}

function renderAuthHook() {
  return renderHook(() => useAuthTest(), {
    wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
  });
}

describe("AuthProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("initializes user from localStorage", () => {
    const storedUser: User = { id: "u1", email: "test@test.com" };
    localStorage.setItem("user", JSON.stringify(storedUser));

    const { result } = renderAuthHook();

    expect(result.current.user).toEqual(storedUser);
  });

  it("logs in a new user and creates default notes", () => {
    const { result } = renderAuthHook();

    act(() => {
      result.current.login("new@test.com");
    });

    const user = result.current.user!;
    expect(user.email).toBe("new@test.com");

    const notes = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(notes).toHaveLength(50);
    expect(notes[0].members[0].email).toBe("new@test.com");
  });

  it("reuses existing userId when email already exists in notes", () => {
    const existingUserId = "existing-id";

    const existingNotes: Note[] = [
      {
        id: "note-1",
        title: "Existing",
        description: [{ type: "paragraph", children: [{ text: "" }] }],
        updatedAt: 1,
        version: 1,
        versions: [],
        members: [{ userId: existingUserId, role: "owner", email: "existing@test.com" }],
      },
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingNotes));

    const { result } = renderAuthHook();

    act(() => {
      result.current.login("existing@test.com");
    });

    expect(result.current.user?.id).toBe(existingUserId);
  });

  it("stores user in localStorage on login", () => {
    const spy = vi.spyOn(localStorage.__proto__, "setItem");

    const { result } = renderAuthHook();

    act(() => {
      result.current.login("persist@test.com");
    });

    expect(spy).toHaveBeenCalledWith("user", expect.stringContaining("persist@test.com"));
  });

  it("logs out correctly", () => {
    const { result } = renderAuthHook();

    act(() => {
      result.current.login("logout@test.com");
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });
});
