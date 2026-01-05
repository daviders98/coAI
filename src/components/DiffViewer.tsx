type Props = {
  incoming: string;
  current: string;

  onAcceptIncoming: () => void;
  onAcceptCurrent: () => void;
  onAcceptBoth: () => void;
  onAcceptMerged?: (merged: string) => void;
};

export default function DiffViewer({
  incoming,
  current,
  onAcceptIncoming,
  onAcceptCurrent,
  onAcceptBoth,
}: Props) {
  return (
    <div className="space-y-3 rounded-md border border-border bg-background p-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="mb-1 text-xs text-muted-foreground">Incoming</p>
          <pre className="whitespace-pre-wrap rounded bg-muted p-2 text-sm">{incoming}</pre>
        </div>

        <div>
          <p className="mb-1 text-xs text-muted-foreground">Your changes</p>
          <pre className="whitespace-pre-wrap rounded bg-muted p-2 text-sm">{current}</pre>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={onAcceptIncoming} className="text-sm underline">
          Accept incoming
        </button>
        <button onClick={onAcceptCurrent} className="text-sm underline">
          Keep yours
        </button>
        <button onClick={onAcceptBoth} className="text-sm underline">
          Accept both
        </button>
      </div>
    </div>
  );
}
