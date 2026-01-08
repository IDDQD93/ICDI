import { useEffect, useRef, useState } from "react";
import maplibregl, {
  MapMouseEvent,
  GeoJSONSource,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type Coord = [number, number];

/* ---------- ORIGIN (ЯКОРНАЯ ТОЧКА) ---------- */
/* можно позже вынести в настройки */
const ORIGIN_LNG = 60.5975;
const ORIGIN_LAT = 56.8389;

/* ---------- METERS → LNG/LAT ---------- */
const metersToLngLat = ([x, y]: [number, number]): [number, number] => {
  const metersPerDegLat = 111_320;
  const metersPerDegLng =
    111_320 * Math.cos((ORIGIN_LAT * Math.PI) / 180);

  return [
    ORIGIN_LNG + x / metersPerDegLng,
    ORIGIN_LAT + y / metersPerDegLat,
  ];
};

/* ---------- RECURSIVE CONVERT ---------- */
const convertCoords = (coords: unknown): unknown => {
  if (
    Array.isArray(coords) &&
    coords.length === 2 &&
    typeof coords[0] === "number" &&
    typeof coords[1] === "number"
  ) {
    return metersToLngLat(coords as [number, number]);
  }

  if (Array.isArray(coords)) {
    return coords.map(convertCoords);
  }

  return coords;
};

/* ---------- DISTANCE UTILS ---------- */
const toRad = (deg: number) => (deg * Math.PI) / 180;

const distanceMeters = (
  [lng1, lat1]: [number, number],
  [lng2, lat2]: [number, number]
) => {
  const R = 6371000; // радиус Земли (м)
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(a));
};

const lineLength = (coords: [number, number][]) => {
  let sum = 0;
  for (let i = 1; i < coords.length; i++) {
    sum += distanceMeters(coords[i - 1], coords[i]);
  }
  return sum;
};

export const MapView = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  const [routeCoords, setRouteCoords] = useState<Coord[]>([]);

  const plusIcon = "/src/assets/icons/plus.svg";
  const minusIcon = "/src/assets/icons/minus.svg";
  const resetIcon = "/src/assets/icons/arrows.svg";

  /* ---------- MAP INIT ---------- */
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [ORIGIN_LNG, ORIGIN_LAT],
      zoom: 13,
    });

    mapRef.current = map;

    map.on("load", () => {
      /* ---------- ROUTE SOURCE ---------- */
      map.addSource("draw-route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: { type: "LineString", coordinates: [] },
          properties: {},
        },
      });

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

      generateMap();
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  /* ---------- BACKEND MAP GENERATION ---------- */
  const generateMap = async () => {
    const map = mapRef.current;
    if (!map) return;

    const res = await fetch("/map/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      console.error("Ошибка /map/generate");
      return;
    }

    const geojson = await res.json();

    /* ---------- CONVERT COORDS ---------- */
    geojson.features.forEach((f: any) => {
      f.geometry.coordinates = convertCoords(
        f.geometry.coordinates
      );
    });

    /* ---------- ROAD LENGTH CALC ---------- */
let totalLength = 0;
let mainRoadLength = 0;
let sideRoadLength = 0;

geojson.features.forEach((f: any) => {
  const kind = f.properties?.kind;
  const geom = f.geometry;

  const add = (coords: [number, number][]) => {
    const len = lineLength(coords);
    totalLength += len;
    if (kind === "main_road") mainRoadLength += len;
    if (kind === "side_road") sideRoadLength += len;
  };

  if (geom.type === "LineString") {
    add(geom.coordinates);
  }

  if (geom.type === "MultiLineString") {
    geom.coordinates.forEach(add);
  }
});

console.log("📏 Длины дорог (метры):");
console.log("Всего:", totalLength.toFixed(1));
console.log("Основные:", mainRoadLength.toFixed(1));
console.log("Второстепенные:", sideRoadLength.toFixed(1));


    const bounds = new maplibregl.LngLatBounds();

    const extendBounds = (coords: unknown) => {
      if (
        Array.isArray(coords) &&
        coords.length === 2 &&
        typeof coords[0] === "number" &&
        typeof coords[1] === "number"
      ) {
        bounds.extend(coords as [number, number]);
      } else if (Array.isArray(coords)) {
        coords.forEach(extendBounds);
      }
    };

    geojson.features.forEach((f: any) =>
      extendBounds(f.geometry.coordinates)
    );

    const source = map.getSource("city") as
      | GeoJSONSource
      | undefined;

    if (source) {
      source.setData(geojson);
    } else {
      map.addSource("city", {
        type: "geojson",
        data: geojson,
      });

      /* ---------- RED ROADS ---------- */
      map.addLayer({
        id: "roads",
        type: "line",
        source: "city",
        paint: {
          "line-color": "red",
          "line-width": 2,
        },
      });
    }

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 80 });
    }
  };

  /* ---------- ROUTE DRAW ---------- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const source = map.getSource("draw-route") as GeoJSONSource;
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

  /* ---------- CLICK ---------- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.on("click", (e: MapMouseEvent) => {
      setRouteCoords((prev) => [
        ...prev,
        [e.lngLat.lng, e.lngLat.lat],
      ]);
    });
  }, []);

  /* ---------- ZOOM CONTROLS ---------- */
  const zoomIn = () => mapRef.current?.zoomIn();
  const zoomOut = () => mapRef.current?.zoomOut();
  const resetZoom = () => mapRef.current?.resetNorthPitch();

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div
        ref={mapContainer}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 16,
          overflow: "hidden",
        }}
      />

      <div className="zoomStack">
        <button className="zoomBtn" onClick={zoomIn}>
          <img src={plusIcon} alt="zoom in" />
        </button>
        <button className="zoomBtn" onClick={zoomOut}>
          <img src={minusIcon} alt="zoom out" />
        </button>
        <button className="zoomBtn" onClick={resetZoom}>
          <img src={resetIcon} alt="reset zoom" />
        </button>
      </div>

      <style>
        {`
          .zoomBtn img {
            width: 35px;
            height: 35px;
          }
          .zoomBtn {
            display: flex;
            justify-content: center;
            align-items: center;
          }
        `}
      </style>
    </div>
  );
};
