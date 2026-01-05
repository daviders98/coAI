import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, UserPlus } from "lucide-react";
import type { FocusField, NoteCardProps } from "./NoteTypes";
import { canDeleteNote, getUserRole } from "./NotePermissions";
import { NoteMembersModal } from "./NoteMembersModal";
import { NoteEditModal } from "./NoteEditModal";
import { slateToPlainText } from "@/lib/utils";
import { ModalFocusField } from "./NoteConstants";

export default function NoteCard({
  note,
  userId,
  onDelete,
  onUpdate,
  isEditOpen,
  onEditOpenChange,
}: NoteCardProps) {
  const role = getUserRole(note, userId);
  const canEdit = role === "owner" || role === "editor";

  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [focusField, setFocusField] = useState<FocusField>(ModalFocusField.TITLE as FocusField);

  return (
    <>
      <li className="group relative min-w-0 max-w-full rounded-lg border border-border bg-card p-4 shadow-sm transition hover:scale-[1.02] hover:shadow-md sm:hover:scale-[1.03] sm:hover:shadow-lg">
        <div className="absolute left-0 top-0 h-full w-1 rounded-l-md bg-primary" />

        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex w-full items-start justify-between">
              <h2
                className={`flex-1 truncate font-medium ${
                  canEdit ? "cursor-pointer sm:hover:underline" : ""
                }`}
                onClick={() => {
                  if (!canEdit) return;
                  setFocusField(ModalFocusField.TITLE as FocusField);
                  onEditOpenChange?.(true, ModalFocusField.TITLE as FocusField);
                }}
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
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(note.id)}
                    aria-label="Delete note"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <p
              className="max-h-24 overflow-hidden break-words text-sm text-muted-foreground hover:cursor-pointer hover:underline"
              onClick={() => {
                if (!canEdit) return;
                setFocusField(ModalFocusField.DESCRIPTION as FocusField);
                onEditOpenChange?.(true, ModalFocusField.DESCRIPTION as FocusField);
              }}
            >
              {slateToPlainText(note.description) || "No description"}
            </p>

            <p className="text-xs capitalize text-muted-foreground">
              {role} • Updated {new Date(note.updatedAt).toLocaleString()}
            </p>
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
