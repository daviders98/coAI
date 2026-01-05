import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Fragment, useEffect, useRef, useState } from "react";
import RichTextEditor from "@/components/RichTextEditor";
import type { NoteDescription, NoteEditModalProps } from "./NoteTypes";
import { DialogDescription } from "@radix-ui/react-dialog";
import { EMPTY_EDITOR_VALUE, ModalFocusField } from "./NoteConstants";
import { slateToPlainText } from "@/lib/utils";
import DiffViewer from "@/components/DiffViewer";
import { TriangleAlert } from "lucide-react";

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

  const [baseVersion, setBaseVersion] = useState<number | null>(null);
  const [, setHasLocalChanges] = useState(false);
  const [conflictDetected, setConflictDetected] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<{ focus: () => void }>(null);

  useEffect(() => {
    if (!open) return;
    const asyncUpdates = async () => {
      setTitle(note.title ?? "");
      setDescription(note.description ?? EMPTY_EDITOR_VALUE);
      setBaseVersion(note.version ?? 1);

      setHasLocalChanges(false);
      setConflictDetected(false);
    };
    asyncUpdates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, note.id]);

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

  function handleSave() {
    if (!note.id) return;

    if (baseVersion != null && note.version !== baseVersion) {
      setConflictDetected(true);
      return;
    }

    onSave({
      id: note.id,
      patch: {
        title: title.trim(),
        description,
      },
    });

    onOpenChange(false);
  }

  const handleAcceptIncoming = () => {
    setTitle(note.title ?? "");
    const finalDescription = note.description ?? EMPTY_EDITOR_VALUE;
    setDescription(finalDescription as NoteDescription[]);

    setConflictDetected(false);
    setBaseVersion(note.version ?? 1);
  };

  const handleAcceptCurrent = () => {
    setConflictDetected(false);
    setHasLocalChanges(true);
    setBaseVersion(note.version ?? 1);
  };

  const handleAcceptBoth = () => {
    const mergedTitle = `${title} / ${note.title ?? ""}`;
    const currentDesc = description;
    const incomingDesc = note.description ?? EMPTY_EDITOR_VALUE;

    const mergedDescription = [...currentDesc, ...incomingDesc];

    setTitle(mergedTitle);
    setDescription(mergedDescription as NoteDescription[]);

    setConflictDetected(false);
    setBaseVersion(note.version ?? 1);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onChange={(e) => {
              setTitle(e.target.value);
              setHasLocalChanges(true);
            }}
            placeholder="Title"
          />

          <RichTextEditor
            ref={editorRef}
            value={description}
            onChange={(v) => {
              setDescription(v);
              setHasLocalChanges(true);
            }}
          />
          {conflictDetected && (
            <Fragment>
              <p className="flex flex-row items-center gap-2 text-sm text-destructive">
                <TriangleAlert />
                This note was updated elsewhere. Resolve conflicts to continue.
              </p>
              <DiffViewer
                incoming={`${note.title ?? ""}\n${slateToPlainText(note.description ?? EMPTY_EDITOR_VALUE)}`}
                current={`${title}\n${slateToPlainText(description)}`}
                onAcceptIncoming={handleAcceptIncoming}
                onAcceptCurrent={handleAcceptCurrent}
                onAcceptBoth={handleAcceptBoth}
              />
            </Fragment>
          )}

          <Button onClick={handleSave} disabled={conflictDetected}>
            {conflictDetected ? "Resolve conflicts to save" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
