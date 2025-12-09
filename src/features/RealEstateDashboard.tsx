import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { dataset } from "./data";
import MapMini from "./components/MapMini";
import PropertyList from "./components/PropertyList";
import { PriceTimeline, BedroomsBar, BedroomsPie } from "./components/Charts";
import SelectedProperty from "./components/SelectedProperty";

export default function RealEstateDashboard() {
  const properties = dataset.results;
  const [query, setQuery] = useState("");
  const [minBeds, setMinBeds] = useState(0);
  const [maxPrice, setMaxPrice] = useState(Infinity);
  const [sortBy, setSortBy] = useState("price_desc");
  const [selected, setSelected] = useState(null);

  const formatCurrency = (n) =>
    n == null
      ? "-"
      : n.toLocaleString(undefined, {
          style: "currency",
          currency: "AUD",
          maximumFractionDigits: 0,
        });

  const bounds = useMemo(() => {
    if (!properties.length)
      return { minLat: 0, maxLat: 0, minLon: 0, maxLon: 0 };

    const lats = properties.map((p) => Number(p.coordinates.latitude));
    const lons = properties.map((p) => Number(p.coordinates.longitude));

    return {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLon: Math.min(...lons),
      maxLon: Math.max(...lons),
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    let list = properties.filter((p) => {
      const beds = p.attributes.bedrooms;
      const price = p.price;
      if (beds < minBeds) return false;
      if (price > maxPrice) return false;
      if (!q) return true;
      return (
        p.area_name.toLowerCase().includes(q) ||
        p.attributes.description.toLowerCase().includes(q)
      );
    });

    if (sortBy === "price_desc") list.sort((a, b) => b.price - a.price);
    if (sortBy === "price_asc") list.sort((a, b) => a.price - b.price);
    if (sortBy === "date_desc")
      list.sort((a, b) => new Date(b.listing_date) - new Date(a.listing_date));

    return list;
  }, [query, minBeds, maxPrice, sortBy]);

  const priceTimeline = useMemo(() => {
    const map = {};
    properties.forEach((p) => {
      const d = p.listing_date;
      map[d] = (map[d] || 0) + p.price;
    });
    return Object.keys(map)
      .sort()
      .map((d) => ({ date: d, total: Math.round(map[d] / 1000) }));
  }, []);

  const byBeds = useMemo(() => {
    const out = {};
    properties.forEach((p) => {
      const b = p.attributes.bedrooms;
      out[b] = (out[b] || 0) + 1;
    });
    return Object.entries(out).map(([bed, count]) => ({ bed, count }));
  }, []);

  const pieData = useMemo(
    () => byBeds.map((b) => ({ name: `${b.bed}bd`, value: b.count })),
    [byBeds]
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">
            Belmont North — Property Insights
          </h1>
          <p className="text-sm text-slate-600">
            Turning raw listings into clear insights and action.
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="bg-white rounded-md p-2 flex items-center gap-2 shadow-sm">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search address or description"
              className="outline-none text-sm"
            />
          </div>
          <div className="text-sm text-slate-600">
            {properties.length} listings
          </div>
        </div>
      </header>

      <main className="grid grid-cols-12 gap-6">
        <section className="col-span-4">
          <div className="bg-white rounded-2xl p-4 shadow">
            <h2 className="font-medium">Filters</h2>
            <div className="mt-3 space-y-3 text-sm">
              <label className="flex items-center justify-between">
                <span>Min bedrooms</span>
                <input
                  type="number"
                  value={minBeds}
                  min={0}
                  onChange={(e) => setMinBeds(Number(e.target.value))}
                  className="w-16 p-1 rounded border text-sm"
                />
              </label>

              <label className="flex items-center justify-between">
                <span>Max price (AUD)</span>
                <input
                  type="number"
                  onChange={(e) =>
                    setMaxPrice(
                      e.target.value ? Number(e.target.value) : Infinity
                    )
                  }
                  className="w-28 p-1 rounded border text-sm"
                />
              </label>

              <label className="flex items-center justify-between">
                <span>Sort</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-1 rounded border text-sm"
                >
                  <option value="price_desc">Price: High → Low</option>
                  <option value="price_asc">Price: Low → High</option>
                  <option value="date_desc">Newest listings</option>
                </select>
              </label>
            </div>
          </div>

          <div className="mt-4 bg-white rounded-2xl p-3 shadow">
            <h3 className="font-medium text-sm">Map (mini)</h3>
            <MapMini
              properties={filtered}
              bounds={bounds}
              onSelect={setSelected}
            />
            <div className="mt-2 text-xs text-slate-500">
              Click a marker to open details
            </div>
          </div>

          <div className="mt-4 bg-white rounded-2xl p-3 shadow">
            <h3 className="font-medium text-sm">Listing timeline (k AUD)</h3>
            <PriceTimeline data={priceTimeline} />
          </div>
        </section>

        <section className="col-span-5">
          <div className="bg-white rounded-2xl p-4 shadow flex flex-col">
            <h2 className="font-medium mb-2">Listings</h2>
            <PropertyList
              list={filtered}
              onSelect={setSelected}
              formatCurrency={formatCurrency}
            />
          </div>
        </section>

        <section className="col-span-3">
          <div className="bg-white rounded-2xl p-4 shadow">
            <h3 className="font-medium">Bedrooms distribution</h3>
            <BedroomsBar data={byBeds} />

            <div className="mt-4">
              <h3 className="font-medium text-sm">Composition</h3>
              <BedroomsPie data={pieData} />
            </div>
          </div>

          <SelectedProperty
            formatCurrency={formatCurrency}
            selected={selected}
          />
        </section>
      </main>
    </div>
  );
}
