import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, UserPlus } from "lucide-react";
import type { NoteCardProps } from "./NoteTypes";
import { canDeleteNote, getUserRole } from "./NotePermissions";
import { NoteMembersModal } from "./NoteMembersModal";
import { NoteEditModal } from "./NoteEditModal";
import { slateToPlainText } from "@/lib/utils";

export default function NoteCard({ note, userId, onDelete, onUpdate }: NoteCardProps) {
  const role = getUserRole(note, userId);

  const canEdit = role === "owner" || role === "editor";

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);

  return (
    <>
      <li className="group relative rounded-lg border p-4 transition hover:shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex w-full items-start justify-between">
              <h2
                className={`flex-1 truncate font-medium ${
                  canEdit ? "cursor-pointer sm:hover:underline" : ""
                }`}
                onClick={() => canEdit && setIsEditOpen(true)}
              >
                {note.title}
              </h2>

              {/* Actions */}
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
              className={`truncate text-sm text-muted-foreground ${
                canEdit ? "cursor-pointer sm:hover:underline" : ""
              }`}
              onClick={() => canEdit && setIsEditOpen(true)}
            >
              {note.description ? slateToPlainText(note.description) : "No description"}
            </p>

            <p className="text-xs capitalize text-muted-foreground">
              {role} • Updated {new Date(note.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </li>

      <NoteEditModal open={isEditOpen} onOpenChange={setIsEditOpen} note={note} onSave={onUpdate} />

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
