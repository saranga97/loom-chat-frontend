import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { useTenant } from "@/providers/TenantProvider";
import type { ChatMessage } from "@/types";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { tenant } = useTenant();
  const isUser = message.role === "user";

  return (
    <div
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser ? "text-white" : "bg-muted text-foreground"
        )}
        style={
          isUser
            ? { backgroundColor: tenant?.theme_colors.primary ?? "#6366f1" }
            : undefined
        }
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5 [&_pre]:bg-foreground/5 [&_pre]:rounded [&_pre]:p-2 [&_code]:text-xs">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
