"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Lock, Landmark } from 'lucide-react';
import GraveyardMapPicker from '@/components/GraveyardMapPicker';
import PlotMapVisualization from '@/components/PlotMapVisualization';
import GraveMapVisualization from '@/components/GraveMapVisualization';

type ViewMode = 'graveyards' | 'plots' | 'graves';

export default function MapsPage() {
  const { isAuthenticated, user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('graveyards');
  const [selectedGraveyardId, setSelectedGraveyardId] = useState<string | null>(null);
  const [selectedGraveyardMapId, setSelectedGraveyardMapId] = useState<string | null>(null);
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(null);
  const [selectedPlotMapId, setSelectedPlotMapId] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl text-center">
          <div className="rounded-full bg-red-100 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Lock className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600">You need to be logged in to view maps.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-3 shadow-lg">
              <Landmark className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">Graveyard Map System</h1>
          </div>
          <p className="text-slate-600 ml-16">Explore graveyards, plots, and graves with GPS coordinates</p>
        </div>

        <div className="mb-6">
          <div className="rounded-xl bg-white shadow-lg p-6">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setViewMode('graveyards');
                  setSelectedGraveyardId(null);
                  setSelectedGraveyardMapId(null);
                }}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  viewMode === 'graveyards'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Graveyards Map
              </button>
              <button
                onClick={() => {
                  setViewMode('plots');
                  setSelectedPlotId(null);
                  setSelectedPlotMapId(null);
                }}
                disabled={!selectedGraveyardMapId}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  viewMode === 'plots'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                    : selectedGraveyardMapId
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                Plots Map
              </button>
              <button
                onClick={() => setViewMode('graves')}
                disabled={!selectedPlotMapId}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  viewMode === 'graves'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                    : selectedPlotMapId
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                Graves Map
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-white shadow-md p-4 border-l-4 border-green-500">
            <p className="text-sm text-slate-600 mb-1">Current View</p>
            <p className="text-lg font-bold text-slate-900">
              {viewMode === 'graveyards' ? 'Graveyards' : viewMode === 'plots' ? 'Plots' : 'Graves'}
            </p>
          </div>
          {selectedGraveyardMapId && (
            <div className="rounded-xl bg-white shadow-md p-4 border-l-4 border-amber-500">
              <p className="text-sm text-slate-600 mb-1">Selected Graveyard Map</p>
              <p className="text-lg font-bold text-slate-900">{selectedGraveyardMapId}</p>
            </div>
          )}
          {selectedPlotMapId && (
            <div className="rounded-xl bg-white shadow-md p-4 border-l-4 border-blue-500">
              <p className="text-sm text-slate-600 mb-1">Selected Plot Map</p>
              <p className="text-lg font-bold text-slate-900">{selectedPlotMapId}</p>
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white shadow-2xl overflow-hidden">
          {viewMode === 'graveyards' && (
            <GraveyardMapPicker
              onSelectGraveyard={(graveyardId) => {
                setSelectedGraveyardId(graveyardId);
              }}
            />
          )}

          {viewMode === 'plots' && selectedGraveyardMapId && (
            <PlotMapVisualization
              graveyardMapId={selectedGraveyardMapId}
              onBack={() => setViewMode('graveyards')}
              onSelectPlot={(plotId) => {
                setSelectedPlotId(plotId);
                setSelectedPlotMapId(`pm-${plotId}`);
              }}
            />
          )}

          {viewMode === 'graves' && selectedPlotMapId && selectedPlotId && (
            <GraveMapVisualization
              plotMapId={selectedPlotMapId}
              plotId={selectedPlotId}
              onBack={() => setViewMode('plots')}
            />
          )}

          {viewMode !== 'graveyards' && !selectedGraveyardMapId && (
            <div className="p-12 text-center">
              <div className="rounded-full bg-slate-100 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Landmark className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-600">Please select a graveyard from the graveyards map first</p>
            </div>
          )}

          {viewMode === 'graves' && !selectedPlotMapId && (
            <div className="p-12 text-center">
              <div className="rounded-full bg-slate-100 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Landmark className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-600">Please select a plot from the plots map first</p>
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-white shadow-lg p-6">
            <div className="rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 p-4 mb-4">
              <Landmark className="h-8 w-8 text-green-600 mb-2" />
              <h3 className="font-bold text-slate-900">Graveyards</h3>
            </div>
            <p className="text-slate-600 text-sm mb-3">View all registered graveyards with GPS coordinates and boundaries.</p>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Always accessible
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow-lg p-6">
            <div className="rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 p-4 mb-4">
              <Landmark className="h-8 w-8 text-amber-600 mb-2" />
              <h3 className="font-bold text-slate-900">Plots</h3>
            </div>
            <p className="text-slate-600 text-sm mb-3">Visualize plot layouts within selected graveyards with precise GPS boundaries.</p>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Requires graveyard selection
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow-lg p-6">
            <div className="rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 p-4 mb-4">
              <Landmark className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-bold text-slate-900">Graves</h3>
            </div>
            <p className="text-slate-600 text-sm mb-3">View individual grave locations with grid positions and GPS coordinates.</p>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Requires plot selection
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
