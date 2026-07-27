import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { PERFIS, type Perfil, type PerfilId } from "./ilha-data";

interface PerfilCtx {
  perfil: Perfil;
  setPerfilId: (id: PerfilId) => void;
}

const Ctx = createContext<PerfilCtx | null>(null);

export function PerfilProvider({ children }: { children: ReactNode }) {
  const [perfilId, setPerfilId] = useState<PerfilId>("defesa-civil");
  const value = useMemo(
    () => ({ perfil: PERFIS.find((p) => p.id === perfilId) ?? PERFIS[0], setPerfilId }),
    [perfilId],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePerfil() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePerfil precisa estar dentro de PerfilProvider");
  return ctx;
}
