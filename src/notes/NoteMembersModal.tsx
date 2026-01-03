import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { NoteMember, MemberRole } from "./NoteTypes";
import { Plus } from "lucide-react";

interface NoteMembersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: NoteMember[];
  onUpdateMembers: (members: NoteMember[]) => void;
}

export function NoteMembersModal({
  open,
  onOpenChange,
  members,
  onUpdateMembers,
}: NoteMembersModalProps) {
  const [localMembers, setLocalMembers] = useState<NoteMember[]>(members);
  const [newMemberEmail, setNewMemberEmail] = useState("");

  useEffect(() => {
    if (open) setLocalMembers(members);
  }, [open, members]);

  const setMemberRole = (id: string, role: MemberRole) => {
    setLocalMembers((prev) => prev.map((m) => (m.userId === id ? { ...m, role } : m)));
  };

  const addMember = (role: MemberRole = "viewer") => {
    const email = newMemberEmail.trim();
    if (!email || !/\S+@\S+\.\S+/.test(email)) return;

    const newMember: NoteMember = {
      userId: Date.now().toString(),
      role,
      email,
    };
    setLocalMembers((prev) => [...prev, newMember]);
    setNewMemberEmail("");
  };

  const saveChanges = () => {
    onUpdateMembers(localMembers);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle id="note-members-title">Manage Members</DialogTitle>
          <DialogDescription id="note-members-desc">
            Add members and assign their roles.
          </DialogDescription>
        </DialogHeader>

        <div aria-describedby="note-members-desc">
          {localMembers.map((m) => (
            <div key={m.userId} className="flex items-center justify-between gap-2">
              <span>{m.email}</span>
              <Select
                value={m.role}
                onValueChange={(val) => setMemberRole(m.userId, val as MemberRole)}
              >
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <div className="mb-4 mt-4 flex gap-2">
          <Input
            placeholder="New member email"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            type="email"
          />
          <Button onClick={() => addMember("viewer")}>
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        <DialogFooter className="flex justify-self-center">
          <Button onClick={saveChanges}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
