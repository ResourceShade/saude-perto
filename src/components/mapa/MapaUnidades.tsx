import { useEffect, useMemo } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  LayersControl,
  ScaleControl,
  useMap,
} from 'react-leaflet'
import { Link } from 'react-router-dom'

import type { Unidade } from '@/types/unidade'
import { ROTULO_TIPO } from '@/types/unidade'

const TILE_URL =
  import.meta.env['VITE_OSM_TILE_URL'] ??
  'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

const SATELITE_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'

const CORES: Record<string, string> = {
  hospital: '#dc2626',
  upa: '#ea580c',
  ubs: '#059669',
  policlinica: '#2563eb',
  odontologia: '#7c3aed',
}

function criarIcone(tipo: string) {
  const cor = CORES[tipo] ?? '#0F5D4A'

  return L.divIcon({
    className: '',
    html: `
      <svg width="36" height="46" viewBox="0 0 36 46"
        xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          d="M18 1C8.6 1 1 8.6 1 18c0 12 17 27 17 27s17-15 17-27C35 8.6 27.4 1 18 1z"
          fill="${cor}"
          stroke="white"
          stroke-width="2"
        />
        <circle cx="18" cy="17" r="11" fill="white"/>
        <path
          d="M18 11v12M12 17h12"
          stroke="${cor}"
          stroke-width="4"
          stroke-linecap="round"
        />
      </svg>
    `,
    iconSize: [36, 46],
    iconAnchor: [18, 46],
    popupAnchor: [0, -42],
  })
}

function AjustaEnquadramento({
  unidades,
}: {
  unidades: Unidade[]
}) {
  const mapa = useMap()

  useEffect(() => {
    const pontos = unidades
      .filter((u) => u.coordenadas)
      .map(
        (u) =>
          [
            u.coordenadas!.lat,
            u.coordenadas!.lon,
          ] as [number, number],
      )

    if (pontos.length > 0) {
      mapa.fitBounds(L.latLngBounds(pontos), {
        padding: [40, 40],
        maxZoom: 15,
      })
    }
  }, [unidades, mapa])

  return null
}

export function MapaUnidades({
  unidades,
}: {
  unidades: Unidade[]
}) {
  const comCoordenada = useMemo(
    () => unidades.filter((u) => u.coordenadas),
    [unidades],
  )

  const primeira = comCoordenada[0]

  if (!primeira?.coordenadas) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-12 text-center text-tinta-suave">
        Nenhuma unidade encontrada possui localização registrada.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
        <div>
          <h3 className="font-semibold text-tinta">
            Mapa de unidades de saúde
          </h3>

          <p className="mt-1 text-sm text-tinta-suave">
            {comCoordenada.length} unidades localizadas
          </p>
        </div>

        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
          Mapa interativo
        </span>
      </div>

      <MapContainer
        center={[
          primeira.coordenadas.lat,
          primeira.coordenadas.lon,
        ]}
        zoom={13}
        scrollWheelZoom={false}
        style={{
          height: '480px',
          width: '100%',
          zIndex: 0,
        }}
      >
        <LayersControl position="topright">

          <LayersControl.BaseLayer
            checked
            name="Mapa padrão"
          >
            <TileLayer
              url={TILE_URL}
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              maxZoom={19}
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Satélite">
            <TileLayer
              url={SATELITE_URL}
              attribution="Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics and the GIS User Community"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>

        </LayersControl>

        <ScaleControl
          position="bottomleft"
          imperial={false}
        />

        <AjustaEnquadramento unidades={comCoordenada} />

        {comCoordenada.map((unidade) => (
          <Marker
            key={unidade.id}
            position={[
              unidade.coordenadas!.lat,
              unidade.coordenadas!.lon,
            ]}
            icon={criarIcone(unidade.tipo)}
          >
            <Popup>
              <div className="min-w-[180px]">

                <span className="block text-xs font-semibold uppercase text-emerald-700">
                  {ROTULO_TIPO[unidade.tipo]}
                </span>

                <span className="mt-2 block text-base font-bold">
                  {unidade.nome}
                </span>

                <p className="mt-2 text-sm text-gray-600">
                  {unidade.endereco ?? 'Endereço não informado'}
                </p>

                <Link
                  to={`/unidades/${unidade.id}`}
                  className="mt-3 block font-semibold underline"
                >
                  Ver detalhes
                </Link>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${unidade.coordenadas!.lat},${unidade.coordenadas!.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block font-semibold underline"
                >
                  Traçar rota no Google Maps
                </a>

              </div>
            </Popup>
          </Marker>
        ))}

      </MapContainer>

      <div className="flex flex-wrap gap-x-5 gap-y-3 border-t border-gray-100 px-5 py-4 text-xs text-gray-600">

        {[
          ['#dc2626', 'Hospitais'],
          ['#ea580c', 'UPAs'],
          ['#059669', 'UBS'],
          ['#2563eb', 'Policlínicas'],
          ['#7c3aed', 'Odontologia'],
        ].map(([cor, nome]) => (
          <div key={nome} className="flex items-center gap-2">
            <span
              className="size-3 rounded-full"
              style={{ backgroundColor: cor }}
            />
            {nome}
          </div>
        ))}

      </div>
    </div>
  )
}