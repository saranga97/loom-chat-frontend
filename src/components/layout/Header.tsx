import { useState } from "react";
import { RotateCcw, X } from "lucide-react";
import { useTenant } from "@/providers/TenantProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onClose?: () => void;
  onRestart?: () => void;
}

export function Header({ onClose, onRestart }: HeaderProps) {
  const { tenant } = useTenant();
  const [restartOpen, setRestartOpen] = useState(false);

  if (!tenant) return null;

  const initials = tenant.chatbot_name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header
      className="relative flex items-center gap-3 px-5 py-4"
      style={{ backgroundColor: tenant.theme_colors.primary }}
    >
      {/* Subtle gradient overlay for depth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />

      {tenant.theme_colors.header_icon ? (
        <span className="relative z-10 text-xl">{tenant.theme_colors.header_icon}</span>
      ) : (
        <Avatar className="relative z-10 h-8 w-8 border-2 border-white/30">
          {tenant.logo_url ? (
            <AvatarImage src={tenant.logo_url} alt={tenant.chatbot_name} />
          ) : null}
          <AvatarFallback
            className="text-xs font-semibold text-white"
            style={{ backgroundColor: tenant.theme_colors.secondary }}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
      )}

      <h1 className="relative z-10 flex-1 text-base font-semibold text-white">
        {tenant.chatbot_name}
      </h1>

      <div className="relative z-10 flex items-center gap-1">
        {onRestart && (
          <Popover open={restartOpen} onOpenChange={setRestartOpen}>
            <Tooltip>
              <PopoverTrigger
                render={
                  <TooltipTrigger
                    render={
                      <button
                        className="group cursor-pointer rounded-full bg-white/10 p-1.5 text-white/80 transition-all hover:scale-110 hover:bg-white/20 hover:text-white active:scale-95"
                        aria-label="Restart chat"
                      >
                        <RotateCcw className="h-4 w-4 transition-transform duration-200 group-hover:rotate-[-45deg]" />
                      </button>
                    }
                  />
                }
              />
              <TooltipContent side="bottom" sideOffset={8}>
                Restart the chat
              </TooltipContent>
            </Tooltip>
            <PopoverContent
              side="bottom"
              align="end"
              sideOffset={8}
              className="w-auto"
            >
              <p className="text-sm font-medium">Start a new conversation?</p>
              <div className="mt-1 flex items-center gap-2">
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => {
                    setRestartOpen(false);
                    onRestart();
                  }}
                >
                  Yes
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setRestartOpen(false)}
                >
                  No
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {onClose && (
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  onClick={onClose}
                  className="cursor-pointer rounded-full bg-white/10 p-1.5 text-white/80 transition-all hover:scale-110 hover:bg-white/20 hover:text-white active:scale-95"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              }
            />
            <TooltipContent side="bottom" sideOffset={8}>
              Close chat
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </header>
  );
}
