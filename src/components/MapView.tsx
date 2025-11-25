import { useEffect, useRef, useState } from "react";
import maplibregl, {
  LngLatLike,
  MapMouseEvent,
  GeoJSONSource,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type Coord = [number, number];

export const MapView = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  const [routeCoords, setRouteCoords] = useState<Coord[]>([]);

  // Инициализация карты и слоёв
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const center: LngLatLike = [60.597, 56.839]; // Екатеринбург

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center,
      zoom: 11,
    });

    mapRef.current = map;

    map.on("load", () => {
      // Пустой source для линии
      map.addSource("draw-route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [],
          },
          properties: {},
        },
      });

      // Линия маршрута
      map.addLayer({
        id: "draw-route-line",
        type: "line",
        source: "draw-route",
        paint: {
          "line-color": "#9C4DFF",
          "line-width": 6,
          "line-opacity": 0.9,
        },
      });

      // Точки на вершинах
      map.addLayer({
        id: "draw-route-points",
        type: "circle",
        source: "draw-route",
        paint: {
          "circle-radius": 4,
          "circle-color": "#ffffff",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#9C4DFF",
        },
      });

      // Клик по карте → добавляем точку
      map.on("click", (e: MapMouseEvent) => {
        const lngLat = e.lngLat;
        setRouteCoords((prev) => [...prev, [lngLat.lng, lngLat.lat]]);
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Обновление геометрии линии при изменении routeCoords
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const source = map.getSource("draw-route") as GeoJSONSource | undefined;
    if (!source) return;

    source.setData({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: routeCoords,
      },
      properties: {},
    });
  }, [routeCoords]);

  const handleReset = () => {
    setRouteCoords([]);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div
        ref={mapContainer}
        style={{ width: "100%", height: "100%", borderRadius: 16, overflow: "hidden" }}
      />
      <button
        onClick={handleReset}
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          padding: "6px 10px",
          borderRadius: 8,
          border: "none",
          background: "#15162f",
          color: "#fff",
          fontSize: 12,
          cursor: "pointer",
          opacity: 0.9,
        }}
      >
        Сбросить линию
      </button>
    </div>
  );
};
