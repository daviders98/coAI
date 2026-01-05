import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import RichTextEditor from "@/components/RichTextEditor";
import type { NoteDescription, NoteEditModalProps } from "./NoteTypes";
import { DialogDescription } from "@radix-ui/react-dialog";
import { EMPTY_EDITOR_VALUE, ModalFocusField } from "./NoteConstants";

export function NoteEditModal({
  open,
  onOpenChange,
  note,
  onSave,
  focusField,
}: NoteEditModalProps) {
  const [title, setTitle] = useState(note.title ?? "");
  const [description, setDescription] = useState<NoteDescription[]>(
    note.description ?? EMPTY_EDITOR_VALUE,
  );

  const titleRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<{ focus: () => void }>(null);

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

  useEffect(() => {
    if (!open) return;

    requestAnimationFrame(() => {
      if (focusField === ModalFocusField.DESCRIPTION) {
        editorRef.current?.focus();
      } else {
        const input = titleRef.current;
        if (!input) return;

        input.focus();
        const len = input.value.length;
        input.setSelectionRange(len, len);
      }
    });
  }, [open, focusField]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-h-[90dvh] w-full max-w-xl overflow-hidden rounded-lg p-4"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Note</DialogTitle>
          <DialogDescription>Enter title and description</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />

          <RichTextEditor ref={editorRef} value={description} onChange={setDescription} />

          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
