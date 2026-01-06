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
import type { NoteMember, MemberRole, NoteMembersModalProps } from "./NoteTypes";
import { Plus, X, UserPlus } from "lucide-react";

export function NoteMembersModal({
  open,
  onOpenChange,
  members,
  onUpdateMembers,
}: NoteMembersModalProps) {
  const [localMembers, setLocalMembers] = useState<NoteMember[]>(members);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<MemberRole>("viewer");

  useEffect(() => {
    if (open) {
      (() => setLocalMembers(members))();
    }
  }, [open, members]);

  const setMemberRole = (id: string, role: MemberRole) => {
    setLocalMembers((prev) => prev.map((m) => (m.userId === id ? { ...m, role } : m)));
  };

  const removeMember = (id: string) => {
    setLocalMembers((prev) => prev.filter((m) => m.userId !== id));
  };

  const addMember = () => {
    const email = newMemberEmail.trim().toLowerCase();
    if (!email || !/\S+@\S+\.\S+/.test(email)) return;

    const alreadyExists = localMembers.some((m) => m.email.toLowerCase() === email);
    if (alreadyExists) return;

    const newMember: NoteMember = {
      userId: Date.now().toString(),
      role: newMemberRole,
      email,
    };
    setLocalMembers((prev) => [newMember, ...prev]);
    setNewMemberEmail("");
    setNewMemberRole("viewer");
  };

  const saveChanges = () => {
    onUpdateMembers(localMembers);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-auto max-h-[85vh] w-[95vw] max-w-md flex-col gap-0 overflow-hidden rounded-xl p-0 sm:max-w-lg">
        <div className="p-6 pb-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">Manage Members</DialogTitle>
            <DialogDescription>Control who can view or edit this note.</DialogDescription>
          </DialogHeader>
        </div>
        <div className="bg-muted/20 border-y px-6 py-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <Input
                className="border-muted-foreground/20 h-11 rounded-xl bg-background"
                placeholder="Collaborator email..."
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                type="email"
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={newMemberRole}
                onValueChange={(val) => setNewMemberRole(val as MemberRole)}
              >
                <SelectTrigger className="h-11 flex-1 rounded-xl sm:w-28">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <Button
                className="h-11 rounded-xl px-4 shadow-sm"
                onClick={addMember}
                disabled={!newMemberEmail}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        <div className="max-h-[40vh] min-h-[200px] flex-1 overflow-y-auto p-6">
          <h4 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <UserPlus className="h-3 w-3" />
            Current Members ({localMembers.length})
          </h4>

          <div className="space-y-3">
            {localMembers.map((m) => (
              <div
                key={m.userId}
                className="bg-muted/10 flex items-center justify-between gap-3 rounded-2xl border border-transparent p-2 pr-1 sm:bg-transparent sm:p-0"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="bg-primary/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-primary">
                    {m.email[0].toUpperCase()}
                  </div>
                  <span className="truncate text-sm font-medium leading-none">{m.email}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Select
                    value={m.role}
                    onValueChange={(val) => setMemberRole(m.userId, val as MemberRole)}
                  >
                    <SelectTrigger className="h-8 w-[85px] border-none bg-transparent text-xs font-semibold text-muted-foreground transition-colors hover:text-primary focus:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-destructive/10 h-8 w-8 rounded-full text-muted-foreground hover:text-destructive"
                    onClick={() => removeMember(m.userId)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t bg-background p-6">
          <DialogFooter>
            <Button
              onClick={saveChanges}
              className="shadow-primary/20 h-12 w-full rounded-2xl text-base font-bold shadow-lg transition-transform active:scale-[0.98]"
            >
              Save
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
