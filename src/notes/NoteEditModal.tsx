import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import RichTextEditor from "@/components/RichTextEditor";
import type { Note, NoteDescription } from "./NoteTypes";
import { DialogDescription } from "@radix-ui/react-dialog";

const EMPTY_EDITOR_VALUE: NoteDescription[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: Partial<Note>;
  onSave: ({ id, patch }: { id: string; patch: Partial<Note> }) => void;
};

export function NoteEditModal({ open, onOpenChange, note, onSave }: Props) {
  const [title, setTitle] = useState(note.title);
  const [description, setDescription] = useState(note.description ?? EMPTY_EDITOR_VALUE);

  function handleSave() {
    if (note.id && title && description) {
      onSave({
        id: note.id,
        patch: {
          title: title.trim(),
          description,
        },
      });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit note</DialogTitle>
        </DialogHeader>
        <DialogDescription id="note-edit-desc">Set title and description</DialogDescription>

        <div className="space-y-4">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />

          <RichTextEditor key={note.id} value={description} onChange={setDescription} />

          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
