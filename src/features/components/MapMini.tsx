import React from "react";

export default function MapMini({ properties, bounds, onSelect }) {
  // padding inside the SVG edges
  const PADDING = 25;

  const project = (lat, lon, w = 320, h = 180) => {
    const { minLat, maxLat, minLon, maxLon } = bounds;

    // Normalize 0–1
    const xNorm = (lon - minLon) / (maxLon - minLon || 1);
    const yNorm = 1 - (lat - minLat) / (maxLat - minLat || 1);

    // Apply padding
    const x = PADDING + xNorm * (w - PADDING * 2);
    const y = PADDING + yNorm * (h - PADDING * 2);

    return { x, y };
  };

  return (
    <div className="mt-3 border rounded overflow-hidden">
      <svg width="100%" viewBox="0 0 320 180" className="block">
        <rect x="0" y="0" width="320" height="180" fill="#f8fafc" />

        {properties.map((p) => {
          const { x, y } = project(
            Number(p.coordinates.latitude),
            Number(p.coordinates.longitude)
          );

          return (
            <g
              key={p.gnaf_pid}
              onClick={() => onSelect(p)}
              style={{ cursor: "pointer" }}
            >
              <circle
                cx={x}
                cy={y}
                r={7}
                fill="#4f46e5"
                stroke="#fff"
                strokeWidth={1.5}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
