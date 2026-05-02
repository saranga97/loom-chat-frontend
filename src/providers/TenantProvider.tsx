import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getTenant } from "@/api/tenant";
import type { TenantConfig } from "@/types";

interface TenantContextValue {
  tenant: TenantConfig | null;
  loading: boolean;
  error: string | null;
}

const TenantContext = createContext<TenantContextValue>({
  tenant: null,
  loading: true,
  error: null,
});

export function useTenant() {
  return useContext(TenantContext);
}

export function TenantProvider({
  tenantName,
  children,
}: {
  tenantName: string;
  children: ReactNode;
}) {
  const [tenant, setTenant] = useState<TenantConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getTenant(tenantName)
      .then((config) => {
        setTenant(config);

        // Set CSS custom properties for tenant theming
        const root = document.documentElement;
        root.style.setProperty(
          "--tenant-primary",
          config.theme_colors.primary
        );
        root.style.setProperty(
          "--tenant-secondary",
          config.theme_colors.secondary
        );
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [tenantName]);

  return (
    <TenantContext.Provider value={{ tenant, loading, error }}>
      {children}
    </TenantContext.Provider>
  );
}
