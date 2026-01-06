import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, UserPlus, Users } from "lucide-react";
import type { FocusField, NoteCardProps } from "./NoteTypes";
import { canDeleteNote, getUserRole } from "./NotePermissions";
import { NoteMembersModal } from "./NoteMembersModal";
import { NoteEditModal } from "./NoteEditModal";
import { slateToPlainText } from "@/lib/utils";
import { ModalFocusField } from "./NoteConstants";

export default function NoteCard({
  note,
  user,
  onDelete,
  onUpdate,
  isEditOpen,
  onEditOpenChange,
}: NoteCardProps) {
  const role = getUserRole(note, user.id, user.email);
  const canEdit = role === "owner" || role === "editor";

  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [focusField, setFocusField] = useState<FocusField>(ModalFocusField.TITLE as FocusField);

  const membersCount = note.members.length;

  return (
    <>
      <li className="group relative flex h-full min-w-0 max-w-full flex-col rounded-lg border border-border bg-card p-4 shadow-sm transition hover:scale-[1.02] hover:shadow-md sm:hover:scale-[1.03] sm:hover:shadow-lg">
        <div className="absolute left-0 top-0 h-full w-1 rounded-l-md bg-primary" />

        <div className="flex h-full flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <h2
              className={`min-w-0 flex-1 truncate font-medium ${
                canEdit ? "cursor-pointer sm:hover:underline" : "cursor-not-allowed opacity-70"
              }`}
              onClick={() => {
                if (!canEdit) return;
                setFocusField(ModalFocusField.TITLE as FocusField);
                onEditOpenChange?.(true, ModalFocusField.TITLE as FocusField);
              }}
              title={canEdit ? note.title || "Untitled" : "You cannot edit this note"}
            >
              {note.title || "Untitled"}
            </h2>

            <div className="flex gap-1 opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMembersOpen(true)}
                aria-label="View members"
              >
                <UserPlus className="h-4 w-4" />
              </Button>

              {canDeleteNote(role) && (
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => onDelete(note.id)}
                  aria-label="Delete note"
                  className="bg-transparent hover:bg-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <p
            className={`line-clamp-3 break-words text-sm text-muted-foreground ${
              canEdit ? "cursor-pointer sm:hover:underline" : "cursor-not-allowed opacity-70"
            }`}
            onClick={() => {
              if (!canEdit) return;
              setFocusField(ModalFocusField.DESCRIPTION as FocusField);
              onEditOpenChange?.(true, ModalFocusField.DESCRIPTION as FocusField);
            }}
          >
            {slateToPlainText(note.description) || "No description"}
          </p>

          <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground">
            {membersCount > 1 && (
              <button
                onClick={() => setIsMembersOpen(true)}
                className="flex items-center gap-1 hover:text-foreground"
                aria-label={`${membersCount} members`}
                title={`${membersCount} members`}
              >
                <Users className="h-4 w-4" />
                <span>{membersCount}</span>
              </button>
            )}

            <span>Updated {new Date(note.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      </li>

      <NoteEditModal
        open={isEditOpen ?? false}
        onOpenChange={(open) => onEditOpenChange?.(open, focusField)}
        note={note}
        onSave={onUpdate}
        focusField={focusField}
      />

      <NoteMembersModal
        open={isMembersOpen}
        onOpenChange={setIsMembersOpen}
        members={note.members}
        onUpdateMembers={(members) =>
          onUpdate({
            id: note.id,
            patch: { members },
          })
        }
      />
    </>
  );
}
