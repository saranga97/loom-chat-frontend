import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTenant } from "@/providers/TenantProvider";

interface UsernameFormProps {
  onSubmit: (username: string) => void;
}

export function UsernameForm({ onSubmit }: UsernameFormProps) {
  const [name, setName] = useState("");
  const { tenant } = useTenant();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-xs flex flex-col gap-4 text-center">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Welcome to {tenant?.chatbot_name ?? "Chat"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your name to start the conversation.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <Button
            type="submit"
            disabled={!name.trim()}
            className="text-white cursor-pointer"
            style={{ backgroundColor: tenant?.theme_colors.primary }}
          >
            Start Chat
          </Button>
        </form>
      </div>
    </div>
  );
}
