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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<NoteDescription[]>(EMPTY_EDITOR_VALUE);

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setTitle(note.title ?? "");
      setDescription(note.description ?? EMPTY_EDITOR_VALUE);
    }
    onOpenChange(nextOpen);
  }

  function handleSave() {
    if (!note.id) return;

    onSave({
      id: note.id,
      patch: {
        title: title.trim(),
        description,
      },
    });

    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90dvh] w-[calc(100vw-1rem)] max-w-none overflow-hidden rounded-lg p-4 sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit note</DialogTitle>
          <DialogDescription>Set title and description</DialogDescription>
        </DialogHeader>

        <div className="min-w-0 space-y-4">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />

          <div className="min-w-0">
            <RichTextEditor value={description} onChange={setDescription} />
          </div>

          <Button className="w-full sm:w-auto" onClick={handleSave}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
