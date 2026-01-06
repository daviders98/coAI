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
import { TriangleAlert, Sparkles } from "lucide-react";
import { rewordNoteLocal } from "@/ai/rewordEngine";

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

  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<{ focus: () => void }>(null);

  useEffect(() => {
    if (!open) return;
    setTitle(note.title ?? "");
    setDescription(note.description ?? EMPTY_EDITOR_VALUE);
    setBaseVersion(note.version ?? 1);
    setHasLocalChanges(false);
    setConflictDetected(false);
    setAiSuggestion(null);
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

  async function handleReword() {
    setAiLoading(true);
    try {
      const text = slateToPlainText(description);
      const improved = await rewordNoteLocal(text);
      setAiSuggestion(improved);
    } finally {
      setAiLoading(false);
    }
  }

  function handleSave() {
    if (!note.id) return;
    if (baseVersion != null && note.version !== baseVersion) {
      setConflictDetected(true);
      return;
    }
    onSave({
      id: note.id,
      patch: { title: title.trim(), description },
    });
    onOpenChange(false);
  }

  const handleAcceptIncoming = () => {
    setTitle(note.title ?? "");
    setDescription((note.description ?? EMPTY_EDITOR_VALUE) as NoteDescription[]);
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
    const mergedDescription = [...description, ...(note.description ?? EMPTY_EDITOR_VALUE)];
    setTitle(mergedTitle);
    setDescription(mergedDescription as NoteDescription[]);
    setConflictDetected(false);
    setBaseVersion(note.version ?? 1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="flex max-h-[95dvh] w-[95dvw] max-w-xl flex-col overflow-hidden rounded-lg p-0 sm:max-h-[90vh]"
      >
        <DialogHeader className="shrink-0 border-b px-4 py-3">
          <DialogTitle className="text-lg font-semibold">Edit Note</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Make changes to your note here.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Title
              </label>
              <Input
                ref={titleRef}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setHasLocalChanges(true);
                }}
                placeholder="Note title..."
                className="h-11 text-base"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Description
              </label>
              <div className="min-h-[180px] rounded-md border">
                <RichTextEditor
                  ref={editorRef}
                  value={description}
                  onChange={(v) => {
                    setDescription(v);
                    setHasLocalChanges(true);
                  }}
                />
              </div>
            </div>

            {(aiSuggestion || conflictDetected) && (
              <div className="bg-muted/40 space-y-4 rounded-lg p-3">
                {aiSuggestion && (
                  <DiffViewer
                    incoming={aiSuggestion}
                    current={slateToPlainText(description)}
                    onAcceptIncoming={() => {
                      setDescription([
                        { type: "paragraph", children: [{ text: aiSuggestion }] },
                      ] as NoteDescription[]);
                      setAiSuggestion(null);
                    }}
                    onAcceptCurrent={() => setAiSuggestion(null)}
                    onAcceptBoth={() => {
                      setDescription(
                        (prev) =>
                          [
                            ...prev,
                            { type: "paragraph", children: [{ text: aiSuggestion }] },
                          ] as NoteDescription[],
                      );
                      setAiSuggestion(null);
                    }}
                  />
                )}

                {conflictDetected && (
                  <Fragment>
                    <p className="flex items-center gap-2 text-sm font-medium text-destructive">
                      <TriangleAlert className="h-4 w-4" />
                      Conflict detected
                    </p>
                    <DiffViewer
                      incoming={slateToPlainText(note.description ?? EMPTY_EDITOR_VALUE)}
                      current={slateToPlainText(description)}
                      onAcceptIncoming={handleAcceptIncoming}
                      onAcceptCurrent={handleAcceptCurrent}
                      onAcceptBoth={handleAcceptBoth}
                    />
                  </Fragment>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 border-t bg-background px-4 py-3">
          <div className="flex flex-col gap-2 sm:flex-row-reverse sm:justify-start">
            <Button
              onClick={handleSave}
              disabled={conflictDetected}
              className="h-11 w-full sm:w-auto"
            >
              {conflictDetected ? "Resolve conflicts" : "Save"}
            </Button>

            <Button
              variant="outline"
              onClick={handleReword}
              disabled={aiLoading || conflictDetected}
              className="h-11 w-full sm:w-auto"
            >
              {aiLoading ? (
                "Rewording…"
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  Reword description
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="h-11 w-full sm:hidden"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
