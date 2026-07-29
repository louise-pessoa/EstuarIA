import { Link } from "@tanstack/react-router";
import { PERFIS, type PerfilId } from "@/lib/ilha-data";
import { usePerfil } from "@/lib/perfil-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import logoEstuarIA from "@/assets/logoEstuarIA.png";
import type { ReactNode } from "react";

const NAV = [
  { to: "/", label: "Visão geral" },
  { to: "/mapa", label: "Mapa e testes" },
  { to: "/calendario", label: "Calendário" },
  { to: "/chat", label: "Assistente" },
] as const;


export function AppShell({ children }: { children: ReactNode }) {
  const { perfil, setPerfilId } = usePerfil();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-sidebar-border bg-sidebar text-sidebar-foreground">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-6 px-5">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center">
              <img src={logoEstuarIA} alt="EstuarIA" className="size-full object-contain" />
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] font-semibold tracking-tight">
                Plataforma de Inteligência Urbana
              </span>
              <span className="block text-[11px] text-sidebar-foreground/65">
                EstuarIA · Prefeitura do Recife
              </span>
            </span>
          </Link>

          <nav className="ml-4 hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-sm px-3 py-2 text-sm text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                activeProps={{
                  className:
                    "rounded-sm px-3 py-2 text-sm bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-[11px] font-semibold uppercase tracking-[0.09em] text-sidebar-foreground/55 lg:block">
              Você está vendo como
            </span>
            <Select value={perfil.id} onValueChange={(v) => setPerfilId(v as PerfilId)}>
              <SelectTrigger className="h-9 w-[210px] border-sidebar-border bg-sidebar-accent text-sidebar-accent-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PERFIS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <nav className="flex items-center gap-1 border-b border-border bg-card px-5 py-2 md:hidden">
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.to === "/" }}
            className="rounded-sm px-3 py-1.5 text-sm text-muted-foreground"
            activeProps={{ className: "rounded-sm px-3 py-1.5 text-sm bg-secondary font-medium" }}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <main className="mx-auto max-w-[1400px] px-5 py-7">{children}</main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-[1400px] px-5 py-5 text-xs text-muted-foreground">
          Versão de teste. Os números aqui são apenas exemplos, não são dados reais
        </div>
      </footer>
    </div>
  );
}
