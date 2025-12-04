"use client";

import { useState } from 'react';
import { useMap } from '@/contexts/MapContext';
import { useGraveyard } from '@/contexts/GraveyardContext';
import { Plus, MapPin, ZoomIn, ZoomOut, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface GraveyardMapPickerProps {
  onSelectGraveyard?: (graveyardId: string) => void;
}

export default function GraveyardMapPicker({ onSelectGraveyard }: GraveyardMapPickerProps) {
  const { graveyardMaps, updateGraveyardMap } = useMap();
  const { graveyards } = useGraveyard();
  const [zoomLevel, setZoomLevel] = useState(3);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [newMapLat, setNewMapLat] = useState('40.7128');
  const [newMapLng, setNewMapLng] = useState('-74.0060');
  const [selectedGraveyardMap, setSelectedGraveyardMap] = useState<string | null>(null);

  const handleZoom = (direction: 'in' | 'out') => {
    setZoomLevel((prev) => {
      if (direction === 'in' && prev < 5) return prev + 1;
      if (direction === 'out' && prev > 1) return prev - 1;
      return prev;
    });
  };

  const handlePan = (dx: number, dy: number) => {
    setPanOffset((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));
  };

  const handleAddMarker = (graveyardMapId: string) => {
    const lat = parseFloat(newMapLat);
    const lng = parseFloat(newMapLng);

    if (!isNaN(lat) && !isNaN(lng)) {
      const bounds = {
        north: lat + 0.01,
        south: lat - 0.01,
        east: lng + 0.01,
        west: lng - 0.01,
      };

      updateGraveyardMap(graveyardMapId, {
        center: { latitude: lat, longitude: lng },
        bounds,
      });

      setNewMapLat('40.7128');
      setNewMapLng('-74.0060');
    }
  };

  const getGraveyardName = (graveyardId: string) => {
    return graveyards.find((g) => g.id === graveyardId)?.name || 'Unknown';
  };

  const mapHeight = Math.max(400, 500);
  const mapWidth = 800;
  const pixelsPerDegree = 50 * zoomLevel;

  return (
    <div className="rounded-2xl bg-white shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-white/10 p-3">
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Graveyard Map Picker</h2>
            <p className="text-slate-300 text-sm">View and manage graveyard locations with GPS coordinates</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
        <div className="lg:col-span-3">
          <div className="rounded-xl border-2 border-slate-200 overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 relative" style={{ height: mapHeight, width: '100%' }}>
            <svg
              width={mapWidth}
              height={mapHeight}
              className="w-full h-full absolute inset-0"
              style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
                cursor: 'grab',
              }}
            >
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
                </pattern>
              </defs>

              <rect width={mapWidth} height={mapHeight} fill="url(#grid)" />

              {graveyardMaps.map((graveyardMap) => {
                const centerX = (mapWidth / 2) + (graveyardMap.center.longitude - graveyardMaps[0]?.center.longitude || 0) * pixelsPerDegree;
                const centerY = (mapHeight / 2) + (graveyardMap.center.latitude - graveyardMaps[0]?.center.latitude || 0) * pixelsPerDegree;

                return (
                  <g key={graveyardMap.id}>
                    <circle cx={centerX} cy={centerY} r="30" fill="rgba(34, 197, 94, 0.3)" stroke="#22c55e" strokeWidth="2" />
                    <circle cx={centerX} cy={centerY} r="8" fill="#22c55e" stroke="white" strokeWidth="2" />

                    <rect
                      x={centerX - 40}
                      y={centerY - 60}
                      width="80"
                      height="40"
                      fill="white"
                      stroke="#22c55e"
                      strokeWidth="1"
                      rx="4"
                      opacity="0.9"
                    />
                    <text
                      x={centerX}
                      y={centerY - 35}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="600"
                      fill="#22c55e"
                    >
                      {getGraveyardName(graveyardMap.graveyardId)}
                    </text>
                    <text
                      x={centerX}
                      y={centerY - 20}
                      textAnchor="middle"
                      fontSize="9"
                      fill="#64748b"
                    >
                      {graveyardMap.center.latitude.toFixed(4)}°
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button
                onClick={() => handleZoom('in')}
                size="sm"
                className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => handleZoom('out')}
                size="sm"
                className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </div>

            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-3 text-sm">
              <p className="font-semibold text-slate-900">Zoom: {zoomLevel}</p>
              <p className="text-slate-600 text-xs mt-1">Click to select</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 p-4">
            <h3 className="font-semibold text-slate-900 mb-3">Graveyards</h3>
            <div className="space-y-2">
              {graveyardMaps.map((graveyardMap) => (
                <button
                  key={graveyardMap.id}
                  onClick={() => {
                    setSelectedGraveyardMap(graveyardMap.id);
                    onSelectGraveyard?.(graveyardMap.graveyardId);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 border ${
                    selectedGraveyardMap === graveyardMap.id
                      ? 'bg-blue-500 text-white border-blue-600 shadow-lg'
                      : 'bg-white text-slate-900 border-slate-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <p className="font-medium text-sm">{getGraveyardName(graveyardMap.graveyardId)}</p>
                  <p className={`text-xs mt-1 ${selectedGraveyardMap === graveyardMap.id ? 'text-blue-100' : 'text-slate-500'}`}>
                    {graveyardMap.center.latitude.toFixed(4)}°, {graveyardMap.center.longitude.toFixed(4)}°
                  </p>
                </button>
              ))}
            </div>
          </div>

          {selectedGraveyardMap && (
            <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-4">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-600" />
                Update Location
              </h3>
              <div className="space-y-2">
                <input
                  type="number"
                  step="0.0001"
                  value={newMapLat}
                  onChange={(e) => setNewMapLat(e.target.value)}
                  placeholder="Latitude"
                  className="w-full px-3 py-2 border border-green-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="number"
                  step="0.0001"
                  value={newMapLng}
                  onChange={(e) => setNewMapLng(e.target.value)}
                  placeholder="Longitude"
                  className="w-full px-3 py-2 border border-green-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <Button
                  onClick={() => handleAddMarker(selectedGraveyardMap)}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 rounded-lg text-sm"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Update Position
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
