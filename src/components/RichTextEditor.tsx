import {
  Slate,
  Editable,
  withReact,
  useSlate,
  type RenderLeafProps,
  type RenderElementProps,
} from "slate-react";
import { createEditor, Editor, Transforms, Element as SlateElement, type Descendant } from "slate";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline, List, ListOrdered } from "lucide-react";
import type { CustomElement, Mark } from "./RichTextEditorTypes";
import type { NoteDescription } from "@/notes/NoteTypes";

const EMPTY_VALUE: NoteDescription[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const isMarkActive = (editor: Editor, format: Mark): boolean => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleMark = (editor: Editor, format: Mark) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor: Editor, format: string) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  });

  return !!match;
};

const toggleBlock = (editor: Editor, format: CustomElement["type"]) => {
  const isActive = isBlockActive(editor, format);
  const isList = format === "bulleted-list" || format === "numbered-list";

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      SlateElement.isElement(n) && (n.type === "bulleted-list" || n.type === "numbered-list"),
    split: true,
  });

  const newType: CustomElement["type"] = !isActive ? (isList ? "list-item" : format) : "paragraph";

  Transforms.setNodes(editor, { type: newType });

  if (!isActive && isList) {
    Transforms.wrapNodes(editor, {
      type: format,
      children: [],
    });
  }
};

function Toolbar() {
  const editor = useSlate();

  return (
    <div className="flex gap-1 rounded-md border p-1">
      <Button
        size="icon"
        variant={isMarkActive(editor, "bold") ? "default" : "ghost"}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark(editor, "bold");
        }}
      >
        <Bold className="h-4 w-4" />
      </Button>

      <Button
        size="icon"
        variant={isMarkActive(editor, "italic") ? "default" : "ghost"}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark(editor, "italic");
        }}
      >
        <Italic className="h-4 w-4" />
      </Button>

      <Button
        size="icon"
        variant={isMarkActive(editor, "underline") ? "default" : "ghost"}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark(editor, "underline");
        }}
      >
        <Underline className="h-4 w-4" />
      </Button>

      <div className="mx-1 h-5 w-px bg-border" />

      <Button
        size="icon"
        variant={isBlockActive(editor, "bulleted-list") ? "default" : "ghost"}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleBlock(editor, "bulleted-list");
        }}
      >
        <List className="h-4 w-4" />
      </Button>

      <Button
        size="icon"
        variant={isBlockActive(editor, "numbered-list") ? "default" : "ghost"}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleBlock(editor, "numbered-list");
        }}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
    </div>
  );
}

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.underline) children = <u>{children}</u>;
  return <span {...attributes}>{children}</span>;
};

const Element = ({ attributes, children, element }: RenderElementProps) => {
  switch (element.type) {
    case "bulleted-list":
      return (
        <ul {...attributes} className="list-disc pl-6">
          {children}
        </ul>
      );
    case "numbered-list":
      return (
        <ol {...attributes} className="list-decimal pl-6">
          {children}
        </ol>
      );
    case "list-item":
      return <li {...attributes}>{children}</li>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

export default function RichTextEditor({
  value,
  onChange,
}: {
  value?: NoteDescription[];
  onChange: (value: NoteDescription[]) => void;
}) {
  const editor = useMemo(() => withReact(createEditor()), []);

  const [editorValue, setEditorValue] = useState<NoteDescription[]>(
    value && value.length ? value : EMPTY_VALUE,
  );

  return (
    <Slate
      editor={editor}
      initialValue={editorValue as Descendant[]}
      onChange={(val) => {
        setEditorValue(val as NoteDescription[]);
        onChange(val as NoteDescription[]);
      }}
    >
      <Toolbar />

      <Editable
        className="min-h-[150px] rounded-md border p-3"
        renderElement={(props) => <Element {...props} />}
        renderLeaf={(props) => <Leaf {...props} />}
      />
    </Slate>
  );
}
