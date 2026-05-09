import { useTenant } from "@/providers/TenantProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface FloatingChatIconProps {
  onClick: () => void;
}

export function FloatingChatIcon({ onClick }: FloatingChatIconProps) {
  const { tenant } = useTenant();
  if (!tenant) return null;

  const { theme_colors } = tenant;
  const floatingIcon = theme_colors.floating_icon;
  const position = theme_colors.position || "right";
  const animation = theme_colors.animation || "";

  const positionClass =
    position === "left"
      ? "left-6"
      : position === "center"
        ? "left-1/2 -translate-x-1/2"
        : "right-6";

  const hasEmoji = floatingIcon && !floatingIcon.startsWith("<img:");

  const initials = tenant.chatbot_name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 ${positionClass} z-50 rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer p-0 border-0 animate-bounce-in ${animation}`}
      style={{ backgroundColor: tenant.theme_colors.primary }}
    >
      {hasEmoji ? (
        <div className="h-14 w-14 flex items-center justify-center text-2xl">
          {floatingIcon}
        </div>
      ) : (
        <Avatar className="h-14 w-14">
          {tenant.logo_url ? (
            <AvatarImage src={tenant.logo_url} alt={tenant.chatbot_name} />
          ) : null}
          <AvatarFallback
            className="text-lg font-bold text-white"
            style={{ backgroundColor: tenant.theme_colors.primary }}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
      )}
    </button>
  );
}
