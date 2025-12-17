import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import maplibregl, {
  LngLatLike,
  MapMouseEvent,
  GeoJSONSource,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type Coord = [number, number];

export type MapViewHandle = {
  zoomIn: () => void;
  zoomOut: () => void;
};
 
export const MapView = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  const [routeCoords, setRouteCoords] = useState<Coord[]>([]);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const originLon = 60;
    const originLat = 56.839;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [originLon, originLat],
      zoom: 16,
    });

    mapRef.current = map;

    map.on("load", async () => {
      /* ---------- ROUTE SOURCE ---------- */
      map.addSource("draw-route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: { type: "LineString", coordinates: [] },
          properties: {},
        },
      });

      /* ---------- LOAD + CONVERT CITY ---------- */
      const res = await fetch("/city_featurecollection.geojson");
      const city = await res.json();

      const metersPerDegLat = 111_320;
      const metersPerDegLon =
        111_320 * Math.cos((originLat * Math.PI) / 180);

      const toLngLat = ([x, y]: [number, number]): [number, number] => [
        originLon + x / metersPerDegLon,
        originLat + y / metersPerDegLat,
      ];

      const convertCoords = (coords: any): any => {
         if (coords == null) return coords;

           // защита от пустых массивов
         if (Array.isArray(coords) && coords.length === 0) return coords;
           // точка [x, y]
         if (
            Array.isArray(coords) &&
            coords.length >= 2 &&
            typeof coords[0] === "number" &&
            typeof coords[1] === "number"
        ) {
            return toLngLat([coords[0], coords[1]]);
        }

        return coords.map(convertCoords);        
      };

      for (const f of city.features) {
        f.geometry.coordinates = convertCoords(
          f.geometry.coordinates
        );
      }

      map.addSource("city", {
        type: "geojson",
        data: city,
      });

      /* ---------- CITY LAYERS ---------- */
      map.addLayer({
        id: "roads",
        type: "line",
        source: "city",
        filter: [
          "in",
          ["get", "kind"],
          ["literal", ["main_road", "side_road"]],
        ],
        paint: {
          "line-color": "#333",
          "line-width": 3,
        },
      });

      map.addLayer({
        id: "houses",
        type: "fill",
        source: "city",
        filter: ["==", ["get", "kind"], "house"],
        paint: {
          "fill-color": "#d9a441",
          "fill-opacity": 0.6,
        },
      });

      /* ---------- ROUTE LAYERS ---------- */
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

      /* ---------- CLICK ---------- */
      map.on("click", (e: MapMouseEvent) => {
        setRouteCoords((prev) => [
          ...prev,
          [e.lngLat.lng, e.lngLat.lat],
        ]);
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

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
    </div>
  );
};