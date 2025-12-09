import React from "react";

export default function PropertyList({ list, onSelect, formatCurrency }) {
  return (
    <div className="space-y-3 overflow-auto" style={{ maxHeight: "60vh" }}>
      {list.map((p) => (
        <article
          key={p.gnaf_pid}
          className="p-3 rounded-lg border hover:shadow-md transition cursor-pointer flex gap-3"
          onClick={() => onSelect(p)}
        >
          <div className="w-24 h-20 bg-slate-100 rounded flex items-center justify-center text-xs text-slate-500">
            Photo
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-sm">{p.area_name}</h3>
              <div className="text-sm font-semibold">
                {formatCurrency(p.price)}
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1 line-clamp-3">
              {p.attributes.description}
            </p>
            <div className="mt-2 text-xs text-slate-600 flex gap-3">
              <div>{p.attributes.bedrooms} bd</div>
              <div>{p.attributes.bathrooms} ba</div>
              <div>{p.attributes.garage_spaces} ga</div>
              <div>{p.attributes.land_size}</div>
              <div className="ml-auto text-xs text-slate-400">
                Listed: {p.listing_date}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
