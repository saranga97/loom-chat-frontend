import { useState, type FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTenant } from "@/providers/TenantProvider";

interface UsernameDialogProps {
  open: boolean;
  onSubmit: (username: string) => void;
}

export function UsernameDialog({ open, onSubmit }: UsernameDialogProps) {
  const [name, setName] = useState("");
  const { tenant } = useTenant();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Welcome to {tenant?.chatbot_name ?? "Chat"}</DialogTitle>
          <DialogDescription>
            Enter your name to start the conversation.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <Button
            type="submit"
            disabled={!name.trim()}
            style={{ backgroundColor: tenant?.theme_colors.primary }}
          >
            Start Chat
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
