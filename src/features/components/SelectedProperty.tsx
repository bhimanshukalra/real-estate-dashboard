export default function SelectedProperty({ selected, formatCurrency }) {
  if (!selected) {
    return (
      <div className="mt-4 bg-white rounded-2xl p-4 shadow">
        <h3 className="font-medium">Selected property</h3>
        <div className="mt-3 text-xs text-slate-500">
          Select a property to see details.
        </div>
      </div>
    );
  }

  const attr = selected.attributes || {};
  const addr = selected.address || {};
  const coord = selected.coordinates || {};

  const rows = [
    { label: "Bedrooms", value: attr.bedrooms },
    { label: "Bathrooms", value: attr.bathrooms },
    { label: "Garage Spaces", value: attr.garage_spaces },
    { label: "Building Size", value: attr.building_size },
    { label: "Land Size", value: attr.land_size },
    { label: "Listing Date", value: selected.listing_date },
    { label: "Property Type", value: selected.property_type },
    { label: "SA1", value: addr.sa1 },
    { label: "Locality", value: addr.sal },
    { label: "State", value: addr.state },
    { label: "Street", value: addr.street },
    { label: "GNAF PID", value: selected.gnaf_pid },
    { label: "Latitude", value: coord.latitude },
    { label: "Longitude", value: coord.longitude },
  ];

  return (
    <div className="mt-4 bg-white rounded-2xl p-4 shadow max-h-[70vh] overflow-auto">
      <h3 className="font-medium text-lg">Selected Property</h3>

      {/* Title + Price */}
      <div className="mt-3">
        <div className="font-semibold text-sm">{selected.area_name}</div>
        <div className="text-slate-600 text-sm mt-1">
          {formatCurrency(selected.price)} • {selected.property_type}
        </div>
      </div>

      {/* Key Attributes Grid */}
      <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
        {rows.map(
          (row) =>
            row.value &&
            row.value !== "None" &&
            row.value !== "nan" &&
            row.value !== "undefined" && (
              <div
                key={row.label}
                className="flex flex-col bg-slate-50 p-2 rounded-md"
              >
                <span className="text-xs text-slate-500">{row.label}</span>
                <span className="font-medium">{row.value}</span>
              </div>
            )
        )}
      </div>

      {/* Description */}
      <div className="mt-6">
        <h4 className="font-medium text-sm text-slate-700 mb-1">Description</h4>
        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
          {attr.description}
        </p>
      </div>
    </div>
  );
}
