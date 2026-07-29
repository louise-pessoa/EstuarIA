import "leaflet/dist/leaflet.css";
import { Fragment } from "react";
import { latLngBounds } from "leaflet";
import { CircleMarker, MapContainer, TileLayer, Tooltip, useMapEvents } from "react-leaflet";
import { PONTOS, TEMAS, type Ponto, type Tema } from "@/lib/ilha-data";
import { SEV_FILL } from "@/components/SeverityBadge";
import { cn } from "@/lib/utils";

interface Props {
  temasAtivos: Tema[];
  selecionado?: Ponto | null;
  onSelect?: (p: Ponto) => void;
  onSelectArea?: (bairro: string, lat: number, lng: number) => void;
  marcadorArea?: { lat: number; lng: number } | null;
  className?: string;
}

// Bounding box em torno da Ilha do Recife (Bairro do Recife, Boa Vista, Santo
// Antônio, São José, Cabanga) para impedir que o usuário navegue pro mundo todo.
const ILHA_BOUNDS = latLngBounds([-8.086, -34.888], [-8.05, -34.865]);

function AreaClickHandler({
  onSelectArea,
}: {
  onSelectArea?: (bairro: string, lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      if (!onSelectArea) return;
      const { lat, lng } = e.latlng;
      const proximo = [...PONTOS].sort(
        (a, b) =>
          (a.lat - lat) ** 2 + (a.lng - lng) ** 2 - ((b.lat - lat) ** 2 + (b.lng - lng) ** 2),
      )[0];
      onSelectArea(proximo.bairro, lat, lng);
    },
  });
  return null;
}

export default function IlhaMapLeaflet({
  temasAtivos,
  selecionado,
  onSelect,
  onSelectArea,
  marcadorArea,
  className,
}: Props) {
  const pontos = PONTOS.filter((p) => temasAtivos.includes(p.tema));

  return (
    <MapContainer
      center={[-8.0631, -34.8711]}
      zoom={15}
      minZoom={13}
      maxBounds={ILHA_BOUNDS}
      maxBoundsViscosity={1}
      className={cn("h-full w-full cursor-crosshair", className)}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      <AreaClickHandler onSelectArea={onSelectArea} />

      {marcadorArea && (
        <>
          <CircleMarker
            center={[marcadorArea.lat, marcadorArea.lng]}
            radius={16}
            pathOptions={{ color: "var(--primary)", fillColor: "var(--primary)", fillOpacity: 0.14, stroke: false }}
          />
          <CircleMarker
            center={[marcadorArea.lat, marcadorArea.lng]}
            radius={5}
            pathOptions={{
              color: "var(--card)",
              weight: 1.5,
              fillColor: "var(--primary)",
              fillOpacity: 1,
            }}
          />
        </>
      )}

      {pontos.map((p) => {
        const ativo = selecionado?.id === p.id;
        return (
          <Fragment key={p.id}>
            <CircleMarker
              center={[p.lat, p.lng]}
              radius={ativo ? 13 : 10}
              bubblingMouseEvents={false}
              pathOptions={{
                color: SEV_FILL[p.severidade],
                fillColor: SEV_FILL[p.severidade],
                fillOpacity: 0.22,
                stroke: false,
              }}
              eventHandlers={{
                click: () => onSelect?.(p),
              }}
            />
            <CircleMarker
              center={[p.lat, p.lng]}
              radius={ativo ? 6 : 4.5}
              bubblingMouseEvents={false}
              pathOptions={{
                color: ativo ? "var(--foreground)" : "var(--card)",
                weight: 1.5,
                fillColor: SEV_FILL[p.severidade],
                fillOpacity: 1,
              }}
              eventHandlers={{
                click: () => onSelect?.(p),
              }}
            >
              <Tooltip>{`${p.nome} — ${TEMAS[p.tema].nome}`}</Tooltip>
            </CircleMarker>
          </Fragment>
        );
      })}
    </MapContainer>
  );
}
