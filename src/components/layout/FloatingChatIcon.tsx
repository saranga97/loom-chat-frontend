import { useTenant } from "@/providers/TenantProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface FloatingChatIconProps {
  onClick: () => void;
}

export function FloatingChatIcon({ onClick }: FloatingChatIconProps) {
  const { tenant } = useTenant();
  if (!tenant) return null;

  const initials = tenant.chatbot_name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 rounded-full shadow-lg hover:shadow-xl transition-shadow cursor-pointer p-0 border-0"
      style={{ backgroundColor: tenant.theme_colors.primary }}
    >
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
    </button>
  );
}
