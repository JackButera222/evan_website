import { useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { motion } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { SHOOT_LOCATIONS } from "../../constants/shootLocations";

const GEOCODE_CACHE_KEY = "tv-geocode-v1";

// Geocode an address via OpenStreetMap's Nominatim (free, no API key).
// Results are cached in localStorage so each visitor geocodes at most once.
async function geocode(address, cache) {
  if (cache[address]) return cache[address];
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`,
    { headers: { Accept: "application/json" } },
  );
  if (!res.ok) throw new Error(`geocode failed: ${res.status}`);
  const [hit] = await res.json();
  if (!hit) throw new Error("no result");
  const coords = { lat: parseFloat(hit.lat), lng: parseFloat(hit.lon) };
  cache[address] = coords;
  localStorage.setItem(GEOCODE_CACHE_KEY, JSON.stringify(cache));
  return coords;
}

// Red Apple Maps-style pin as an inline SVG divIcon (avoids Leaflet's
// bundler-unfriendly default marker images).
const pinIcon = L.divIcon({
  className: "",
  html: `<svg width="30" height="42" viewBox="0 0 30 42" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 0C6.7 0 0 6.7 0 15c0 11.2 15 27 15 27s15-15.8 15-27C30 6.7 23.3 0 15 0z" fill="#ff3b30"/>
    <circle cx="15" cy="15" r="5.5" fill="#fff"/>
  </svg>`,
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -40],
});

function MapWindow({ isOpen, onClose, getWindowProps }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!isOpen || !containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, { scrollWheelZoom: true }).setView(
      [34.05, -118.35],
      10,
    );
    // CARTO Voyager tiles — light, pastel styling close to Apple Maps
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      subdomains: "abcd",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(map);
    mapRef.current = map;

    let cancelled = false;
    (async () => {
      let cache = {};
      try {
        cache = JSON.parse(localStorage.getItem(GEOCODE_CACHE_KEY) ?? "{}");
      } catch {
        cache = {};
      }
      const placed = [];
      for (const loc of SHOOT_LOCATIONS) {
        try {
          // Nominatim allows ~1 request/second — pace uncached lookups
          if (!cache[loc.address]) {
            await new Promise((r) => setTimeout(r, 1100));
          }
          const coords = await geocode(loc.address, cache);
          if (cancelled) return;
          const marker = L.marker([coords.lat, coords.lng], { icon: pinIcon }).addTo(map);
          marker.bindPopup(
            `<strong>${loc.label}</strong><br/><span style="color:#666">${loc.address}</span>${
              loc.note ? `<br/>${loc.note}` : ""
            }`,
          );
          placed.push([coords.lat, coords.lng]);
        } catch {
          // skip addresses that fail to geocode
        }
      }
      if (!cancelled && placed.length) {
        map.fitBounds(L.latLngBounds(placed).pad(0.25));
        setStatus("ready");
      } else if (!cancelled) {
        setStatus("empty");
      }
    })();

    return () => {
      cancelled = true;
      map.remove();
      mapRef.current = null;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Rnd {...getWindowProps} dragHandleClassName="map-title-bar" cancel=".window-control, .map-canvas">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/20 bg-zinc-900 shadow-2xl"
      >
        <div className="map-title-bar flex h-11 touch-none cursor-grab items-center gap-2 border-b border-white/10 bg-zinc-900 px-4 active:cursor-grabbing">
          <button type="button" aria-label="Close Maps" onClick={onClose}
            className="window-control w-3.5 h-3.5 rounded-full bg-red-500 border border-red-300/50 hover:bg-red-400" />
          <button type="button" aria-label="Minimize"
            className="window-control w-3.5 h-3.5 rounded-full bg-yellow-400 border border-yellow-200/50" />
          <button type="button" aria-label="Zoom"
            className="window-control w-3.5 h-3.5 rounded-full bg-green-500 border border-green-300/50" />
          <div className="ml-3 text-sm font-medium text-white/85">Maps — Shoot Locations</div>
        </div>

        <div className="relative min-h-0 flex-1">
          <div ref={containerRef} className="map-canvas h-full w-full" />
          {status === "loading" && (
            <div className="pointer-events-none absolute inset-x-0 top-2 z-[1000] flex justify-center">
              <span className="rounded-full bg-black/60 px-3 py-1 text-xs text-white/80 backdrop-blur">
                Dropping pins…
              </span>
            </div>
          )}
          {status === "empty" && (
            <div className="pointer-events-none absolute inset-x-0 top-2 z-[1000] flex justify-center">
              <span className="rounded-full bg-black/60 px-3 py-1 text-xs text-white/80 backdrop-blur">
                Couldn't load shoot locations
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </Rnd>
  );
}

export default MapWindow;
