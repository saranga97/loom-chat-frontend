import { useTenant } from "@/providers/TenantProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  onClose?: () => void;
}

export function Header({ onClose }: HeaderProps) {
  const { tenant } = useTenant();
  if (!tenant) return null;

  const initials = tenant.chatbot_name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header
      className="flex items-center gap-3 px-4 py-3 border-b border-border"
      style={{ backgroundColor: tenant.theme_colors.primary }}
    >
      <Avatar className="h-9 w-9 border-2 border-white/30">
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
      <h1 className="flex-1 text-base font-semibold text-white">
        {tenant.chatbot_name}
      </h1>
      {onClose && (
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors cursor-pointer"
          aria-label="Close chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </header>
  );
}
