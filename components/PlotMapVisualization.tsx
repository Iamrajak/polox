"use client";

import { useState } from 'react';
import { useMap } from '@/contexts/MapContext';
import { useGraveyard } from '@/contexts/GraveyardContext';
import { Grid3x3, MapPin, ArrowLeft, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlotMapVisualizationProps {
  graveyardMapId: string;
  onBack: () => void;
  onSelectPlot?: (plotId: string) => void;
}

export default function PlotMapVisualization({
  graveyardMapId,
  onBack,
  onSelectPlot,
}: PlotMapVisualizationProps) {
  const { getPlotMapsByGraveyard } = useMap();
  const { plots } = useGraveyard();
  const [zoomLevel, setZoomLevel] = useState(2);
  const [selectedPlotMap, setSelectedPlotMap] = useState<string | null>(null);

  const plotMaps = getPlotMapsByGraveyard(graveyardMapId);
  const mapHeight = 600;
  const mapWidth = 900;

  const handleZoom = (direction: 'in' | 'out') => {
    setZoomLevel((prev) => {
      if (direction === 'in' && prev < 4) return prev + 1;
      if (direction === 'out' && prev > 1) return prev - 1;
      return prev;
    });
  };

  const getPlotName = (plotId: string) => {
    return plots.find((p) => p.id === plotId)?.plotNumber || 'Unknown';
  };

  const getPlotDimensions = (plotId: string) => {
    const plot = plots.find((p) => p.id === plotId);
    return plot ? `${plot.rows}×${plot.columns}` : 'N/A';
  };

  const pixelScale = 50 * zoomLevel;

  return (
    <div className="rounded-2xl bg-white shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-white/10 p-3">
            <Grid3x3 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Plot Map Visualization</h2>
            <p className="text-slate-300 text-sm">View plot locations and dimensions</p>
          </div>
        </div>
        <Button
          onClick={onBack}
          variant="outline"
          className="text-white border-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Graveyards
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
        <div className="lg:col-span-3">
          <div
            className="rounded-xl border-2 border-slate-200 overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 relative"
            style={{ height: mapHeight }}
          >
            <svg width="100%" height="100%" className="w-full h-full">
              <defs>
                <pattern id="plotGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#fef3c7" strokeWidth="1" />
                </pattern>
              </defs>

              <rect width="100%" height="100%" fill="url(#plotGrid)" />

              {plotMaps.map((plotMap) => {
                const x = (plotMap.position.x * pixelScale) / 50;
                const y = (plotMap.position.y * pixelScale) / 50;
                const width = (plotMap.size.width * pixelScale) / 50;
                const height = (plotMap.size.height * pixelScale) / 50;
                const isSelected = selectedPlotMap === plotMap.id;

                return (
                  <g key={plotMap.id}>
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={isSelected ? '#fbbf24' : '#fef3c7'}
                      stroke={isSelected ? '#d97706' : '#f59e0b'}
                      strokeWidth={isSelected ? '3' : '2'}
                      rx="4"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setSelectedPlotMap(plotMap.id);
                        onSelectPlot?.(plotMap.plotId);
                      }}
                    />

                    <text
                      x={x + width / 2}
                      y={y + height / 2 - 10}
                      textAnchor="middle"
                      fontSize="14"
                      fontWeight="600"
                      fill={isSelected ? '#92400e' : '#92400e'}
                      style={{ pointerEvents: 'none' }}
                    >
                      {getPlotName(plotMap.plotId)}
                    </text>
                    <text
                      x={x + width / 2}
                      y={y + height / 2 + 10}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#b45309"
                      style={{ pointerEvents: 'none' }}
                    >
                      {getPlotDimensions(plotMap.plotId)}
                    </text>

                    <circle cx={x} cy={y} r="4" fill="#dc2626" />
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
              <p className="text-slate-600 text-xs mt-1">Total Plots: {plotMaps.length}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-4">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Grid3x3 className="h-4 w-4 text-amber-600" />
              Plots List
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {plotMaps.map((plotMap) => (
                <button
                  key={plotMap.id}
                  onClick={() => {
                    setSelectedPlotMap(plotMap.id);
                    onSelectPlot?.(plotMap.plotId);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 border ${
                    selectedPlotMap === plotMap.id
                      ? 'bg-amber-500 text-white border-amber-600 shadow-lg'
                      : 'bg-white text-slate-900 border-slate-200 hover:border-amber-300 hover:shadow-md'
                  }`}
                >
                  <p className="font-medium text-sm">{getPlotName(plotMap.plotId)}</p>
                  <p className={`text-xs mt-1 ${selectedPlotMap === plotMap.id ? 'text-amber-100' : 'text-slate-500'}`}>
                    {getPlotDimensions(plotMap.plotId)} • {plotMap.size.width.toFixed(0)}×{plotMap.size.height.toFixed(0)}px
                  </p>
                  <p className={`text-xs mt-1 ${selectedPlotMap === plotMap.id ? 'text-amber-100' : 'text-slate-500'}`}>
                    GPS: {plotMap.topLeft.latitude.toFixed(4)}°
                  </p>
                </button>
              ))}
            </div>
          </div>

          {selectedPlotMap && (
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 p-4">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                Coordinates
              </h3>
              <div className="space-y-2 text-sm">
                {plotMaps
                  .filter((m) => m.id === selectedPlotMap)
                  .map((plotMap) => (
                    <div key={plotMap.id} className="bg-white rounded p-2 border border-blue-200">
                      <p className="font-medium text-blue-900 mb-2">Top Left:</p>
                      <p className="text-xs text-blue-700">
                        {plotMap.topLeft.latitude.toFixed(6)}°, {plotMap.topLeft.longitude.toFixed(6)}°
                      </p>
                      <p className="font-medium text-blue-900 mb-1 mt-2">Bottom Right:</p>
                      <p className="text-xs text-blue-700">
                        {plotMap.bottomRight.latitude.toFixed(6)}°, {plotMap.bottomRight.longitude.toFixed(6)}°
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
