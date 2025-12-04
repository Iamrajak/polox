"use client";

import { useState } from 'react';
import { useMap } from '@/contexts/MapContext';
import { useGraveyard } from '@/contexts/GraveyardContext';
import { Boxes, MapPin, ArrowLeft, ZoomIn, ZoomOut, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GraveMapVisualizationProps {
  plotMapId: string;
  plotId: string;
  onBack: () => void;
}

export default function GraveMapVisualization({
  plotMapId,
  plotId,
  onBack,
}: GraveMapVisualizationProps) {
  const { getGraveMapsByPlot } = useMap();
  const { plots, graves } = useGraveyard();
  const [zoomLevel, setZoomLevel] = useState(2);
  const [selectedGraveMap, setSelectedGraveMap] = useState<string | null>(null);

  const graveMaps = getGraveMapsByPlot(plotMapId);
  const plot = plots.find((p) => p.id === plotId);
  const mapHeight = 700;
  const mapWidth = 800;

  const handleZoom = (direction: 'in' | 'out') => {
    setZoomLevel((prev) => {
      if (direction === 'in' && prev < 5) return prev + 1;
      if (direction === 'out' && prev > 1) return prev - 1;
      return prev;
    });
  };

  const getGraveName = (graveId: string) => {
    const grave = graves.find((g) => g.id === graveId);
    return grave ? `Grave ${grave.graveNumber}` : 'Unknown';
  };

  const getGraveStatus = (graveId: string) => {
    const grave = graves.find((g) => g.id === graveId);
    return grave?.status || 'unknown';
  };

  const cellWidth = 25 * zoomLevel;
  const cellHeight = 30 * zoomLevel;
  const padding = 40;

  const totalWidth = (plot?.columns || 0) * cellWidth + padding * 2;
  const totalHeight = (plot?.rows || 0) * cellHeight + padding * 2;

  return (
    <div className="rounded-2xl bg-white shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-white/10 p-3">
            <Boxes className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Grave Map Visualization</h2>
            <p className="text-slate-300 text-sm">Plot {plot?.plotNumber} • {plot?.rows}×{plot?.columns} Grid</p>
          </div>
        </div>
        <Button
          onClick={onBack}
          variant="outline"
          className="text-white border-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-6">
        <div className="lg:col-span-3">
          <div
            className="rounded-xl border-2 border-slate-200 overflow-auto bg-gradient-to-br from-slate-50 to-slate-100 relative"
            style={{ height: mapHeight, maxHeight: '100%' }}
          >
            <svg width={totalWidth} height={totalHeight} className="m-auto block">
              <defs>
                <pattern id="gridPattern" width={cellWidth} height={cellHeight} patternUnits="userSpaceOnUse">
                  <rect width={cellWidth} height={cellHeight} fill="white" stroke="#e2e8f0" strokeWidth="1" />
                </pattern>
              </defs>

              <rect width={totalWidth} height={totalHeight} fill="url(#gridPattern)" />

              <text
                x={totalWidth / 2}
                y={30}
                textAnchor="middle"
                fontSize="16"
                fontWeight="700"
                fill="#1e293b"
              >
                Plot {plot?.plotNumber} - {graveMaps.length} Graves
              </text>

              {graveMaps.map((graveMap) => {
                const x = padding + graveMap.gridPosition.column * cellWidth;
                const y = padding + 40 + graveMap.gridPosition.row * cellHeight;
                const isSelected = selectedGraveMap === graveMap.id;
                const status = getGraveStatus(graveMap.graveId);
                const isAvailable = status === 'available';

                const fillColor = isSelected
                  ? '#3b82f6'
                  : isAvailable
                  ? '#d1fae5'
                  : '#fecaca';

                const strokeColor = isSelected ? '#1e40af' : isAvailable ? '#10b981' : '#dc2626';

                return (
                  <g key={graveMap.id}>
                    <rect
                      x={x}
                      y={y}
                      width={cellWidth}
                      height={cellHeight}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? '2' : '1.5'}
                      rx="2"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedGraveMap(graveMap.id)}
                    />
                    <text
                      x={x + cellWidth / 2}
                      y={y + cellHeight / 2 + 4}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="600"
                      fill={isSelected ? 'white' : strokeColor}
                      style={{ pointerEvents: 'none' }}
                    >
                      {graveMap.gridPosition.row + 1}-{graveMap.gridPosition.column + 1}
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

            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-3">
              <p className="font-semibold text-slate-900 text-sm">Zoom: {zoomLevel}x</p>
              <div className="flex gap-3 mt-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-emerald-200 border border-green-600 rounded"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-200 border border-red-600 rounded"></div>
                  <span>Occupied</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 p-4">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Boxes className="h-4 w-4 text-blue-600" />
              Graves List
            </h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {graveMaps.map((graveMap) => {
                const status = getGraveStatus(graveMap.graveId);
                const isAvailable = status === 'available';

                return (
                  <button
                    key={graveMap.id}
                    onClick={() => setSelectedGraveMap(graveMap.id)}
                    className={`w-full text-left p-2 rounded-lg transition-all duration-200 border text-xs ${
                      selectedGraveMap === graveMap.id
                        ? 'bg-blue-500 text-white border-blue-600 shadow-lg'
                        : 'bg-white text-slate-900 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <p className="font-medium">{getGraveName(graveMap.graveId)}</p>
                    <p className={`mt-1 ${selectedGraveMap === graveMap.id ? 'text-blue-100' : 'text-slate-500'}`}>
                      Row {graveMap.gridPosition.row + 1}, Col {graveMap.gridPosition.column + 1}
                    </p>
                    <p className={`text-xs mt-1 flex items-center gap-1 ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                      <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-600' : 'bg-red-600'}`}></span>
                      {isAvailable ? 'Available' : 'Occupied'}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedGraveMap && (
            <div className="rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 p-4">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Info className="h-4 w-4 text-purple-600" />
                Details
              </h3>
              {graveMaps
                .filter((m) => m.id === selectedGraveMap)
                .map((graveMap) => {
                  const status = getGraveStatus(graveMap.graveId);
                  const isAvailable = status === 'available';

                  return (
                    <div key={graveMap.id} className="bg-white rounded p-3 border border-purple-200 text-sm space-y-2">
                      <p>
                        <span className="font-medium text-purple-900">Grave:</span>
                        <span className="text-purple-700 ml-1">{getGraveName(graveMap.graveId)}</span>
                      </p>
                      <p>
                        <span className="font-medium text-purple-900">Position:</span>
                        <span className="text-purple-700 ml-1">
                          {graveMap.gridPosition.row + 1}-{graveMap.gridPosition.column + 1}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium text-purple-900">Status:</span>
                        <span className={`ml-1 font-semibold ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                          {isAvailable ? 'Available' : 'Occupied'}
                        </span>
                      </p>
                      <p className="text-xs text-slate-500 mt-2">
                        <MapPin className="h-3 w-3 inline mr-1" />
                        GPS: {graveMap.position.latitude.toFixed(6)}°, {graveMap.position.longitude.toFixed(6)}°
                      </p>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
