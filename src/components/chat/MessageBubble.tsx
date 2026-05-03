import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { useTenant } from "@/providers/TenantProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ChatMessage } from "@/types";

interface MessageBubbleProps {
  message: ChatMessage;
  showAvatar: boolean;
}

export function MessageBubble({ message, showAvatar }: MessageBubbleProps) {
  const { tenant } = useTenant();
  const isUser = message.role === "user";

  const botInitials = tenant?.chatbot_name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "AI";

  return (
    <div
      className={cn(
        "flex items-end gap-2",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar slot */}
      <div className="w-7 shrink-0">
        {showAvatar && (
          <Avatar className="h-7 w-7">
            {!isUser && tenant?.logo_url ? (
              <AvatarImage src={tenant.logo_url} alt={tenant.chatbot_name} />
            ) : null}
            <AvatarFallback
              className={cn(
                "text-[10px] font-semibold",
                isUser
                  ? "bg-gray-400 text-white"
                  : "text-white"
              )}
              style={
                !isUser
                  ? { backgroundColor: tenant?.theme_colors.primary }
                  : undefined
              }
            >
              {isUser ? "U" : botInitials}
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-gray-800 text-white rounded-br-md"
            : "bg-gray-100 text-foreground rounded-bl-md"
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap m-0">{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5 [&_pre]:bg-foreground/5 [&_pre]:rounded [&_pre]:p-2 [&_code]:text-xs [&_h2]:text-sm [&_h3]:text-sm [&_h2]:mt-2 [&_h3]:mt-2">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
