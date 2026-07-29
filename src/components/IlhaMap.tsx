import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";
import type { Ponto, Tema } from "@/lib/ilha-data";
import { cn } from "@/lib/utils";

interface Props {
  temasAtivos: Tema[];
  selecionado?: Ponto | null;
  onSelect?: (p: Ponto) => void;
  onSelectArea?: (bairro: string, lat: number, lng: number) => void;
  marcadorArea?: { lat: number; lng: number } | null;
  className?: string;
}

const IlhaMapLeaflet = lazy(() => import("./IlhaMapLeaflet"));

function MapSkeleton({ className }: { className?: string }) {
  return <div className={cn("h-full w-full animate-pulse bg-agua", className)} />;
}

/** Mapa da Ilha do Recife com camadas de dados, renderizado só no cliente (Leaflet não roda em SSR). */
export function IlhaMap(props: Props) {
  return (
    <ClientOnly fallback={<MapSkeleton className={props.className} />}>
      <Suspense fallback={<MapSkeleton className={props.className} />}>
        <IlhaMapLeaflet {...props} />
      </Suspense>
    </ClientOnly>
  );
}
