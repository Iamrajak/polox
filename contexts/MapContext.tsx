"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface GPSCoordinate {
  latitude: number;
  longitude: number;
}

export interface GraveyardMap {
  id: string;
  graveyardId: string;
  center: GPSCoordinate;
  zoomLevel: number;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  createdAt: Date;
}

export interface PlotMap {
  id: string;
  plotId: string;
  graveyardMapId: string;
  topLeft: GPSCoordinate;
  topRight: GPSCoordinate;
  bottomLeft: GPSCoordinate;
  bottomRight: GPSCoordinate;
  position: { x: number; y: number };
  size: { width: number; height: number };
  createdAt: Date;
}

export interface GraveMap {
  id: string;
  graveId: string;
  plotMapId: string;
  position: GPSCoordinate;
  gridPosition: { row: number; column: number };
  size: { width: number; height: number };
  createdAt: Date;
}

interface MapContextType {
  graveyardMaps: GraveyardMap[];
  plotMaps: PlotMap[];
  graveMaps: GraveMap[];
  addGraveyardMap: (map: Omit<GraveyardMap, 'id' | 'createdAt'>) => void;
  updateGraveyardMap: (id: string, map: Partial<GraveyardMap>) => void;
  deleteGraveyardMap: (id: string) => void;
  addPlotMap: (map: Omit<PlotMap, 'id' | 'createdAt'>) => void;
  updatePlotMap: (id: string, map: Partial<PlotMap>) => void;
  deletePlotMap: (id: string) => void;
  addGraveMap: (map: Omit<GraveMap, 'id' | 'createdAt'>) => void;
  updateGraveMap: (id: string, map: Partial<GraveMap>) => void;
  deleteGraveMap: (id: string) => void;
  getGraveyardMapById: (id: string) => GraveyardMap | undefined;
  getPlotMapsByGraveyard: (graveyardMapId: string) => PlotMap[];
  getGraveMapsByPlot: (plotMapId: string) => GraveMap[];
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const [graveyardMaps, setGraveyardMaps] = useState<GraveyardMap[]>([
    {
      id: 'gm-1',
      graveyardId: '1',
      center: { latitude: 40.7128, longitude: -74.0060 },
      zoomLevel: 3,
      bounds: {
        north: 40.7228,
        south: 40.7028,
        east: -74.0000,
        west: -74.0120,
      },
      createdAt: new Date('2024-01-15'),
    },
    {
      id: 'gm-2',
      graveyardId: '2',
      center: { latitude: 34.0522, longitude: -118.2437 },
      zoomLevel: 3,
      bounds: {
        north: 34.0622,
        south: 34.0422,
        east: -118.2337,
        west: -118.2537,
      },
      createdAt: new Date('2024-02-20'),
    },
  ]);

  const [plotMaps, setPlotMaps] = useState<PlotMap[]>([
    {
      id: 'pm-1',
      plotId: '1',
      graveyardMapId: 'gm-1',
      topLeft: { latitude: 40.7180, longitude: -74.0100 },
      topRight: { latitude: 40.7180, longitude: -74.0050 },
      bottomLeft: { latitude: 40.7120, longitude: -74.0100 },
      bottomRight: { latitude: 40.7120, longitude: -74.0050 },
      position: { x: 50, y: 50 },
      size: { width: 150, height: 200 },
      createdAt: new Date('2024-01-16'),
    },
    {
      id: 'pm-2',
      plotId: '2',
      graveyardMapId: 'gm-1',
      topLeft: { latitude: 40.7180, longitude: -74.0020 },
      topRight: { latitude: 40.7180, longitude: 74.0030 },
      bottomLeft: { latitude: 40.7120, longitude: -74.0020 },
      bottomRight: { latitude: 40.7120, longitude: -74.0030 },
      position: { x: 220, y: 50 },
      size: { width: 120, height: 180 },
      createdAt: new Date('2024-01-17'),
    },
  ]);

  const [graveMaps, setGraveMaps] = useState<GraveMap[]>([
    {
      id: 'grm-1',
      graveId: '1-1',
      plotMapId: 'pm-1',
      position: { latitude: 40.7175, longitude: -74.0095 },
      gridPosition: { row: 0, column: 0 },
      size: { width: 20, height: 25 },
      createdAt: new Date('2024-01-16'),
    },
    {
      id: 'grm-2',
      graveId: '1-2',
      plotMapId: 'pm-1',
      position: { latitude: 40.7175, longitude: -74.0090 },
      gridPosition: { row: 0, column: 1 },
      size: { width: 20, height: 25 },
      createdAt: new Date('2024-01-16'),
    },
    {
      id: 'grm-3',
      graveId: '1-5',
      plotMapId: 'pm-1',
      position: { latitude: 40.7160, longitude: -74.0095 },
      gridPosition: { row: 1, column: 0 },
      size: { width: 20, height: 25 },
      createdAt: new Date('2024-01-16'),
    },
  ]);

  const addGraveyardMap = (map: Omit<GraveyardMap, 'id' | 'createdAt'>) => {
    const newMap: GraveyardMap = {
      ...map,
      id: `gm-${Date.now()}`,
      createdAt: new Date(),
    };
    setGraveyardMaps((prev) => [...prev, newMap]);
  };

  const updateGraveyardMap = (id: string, updates: Partial<GraveyardMap>) => {
    setGraveyardMaps((prev) =>
      prev.map((map) => (map.id === id ? { ...map, ...updates } : map))
    );
  };

  const deleteGraveyardMap = (id: string) => {
    setGraveyardMaps((prev) => prev.filter((map) => map.id !== id));
    setPlotMaps((prev) => prev.filter((map) => map.graveyardMapId !== id));
  };

  const addPlotMap = (map: Omit<PlotMap, 'id' | 'createdAt'>) => {
    const newMap: PlotMap = {
      ...map,
      id: `pm-${Date.now()}`,
      createdAt: new Date(),
    };
    setPlotMaps((prev) => [...prev, newMap]);
  };

  const updatePlotMap = (id: string, updates: Partial<PlotMap>) => {
    setPlotMaps((prev) =>
      prev.map((map) => (map.id === id ? { ...map, ...updates } : map))
    );
  };

  const deletePlotMap = (id: string) => {
    setPlotMaps((prev) => prev.filter((map) => map.id !== id));
    setGraveMaps((prev) => prev.filter((map) => map.plotMapId !== id));
  };

  const addGraveMap = (map: Omit<GraveMap, 'id' | 'createdAt'>) => {
    const newMap: GraveMap = {
      ...map,
      id: `grm-${Date.now()}`,
      createdAt: new Date(),
    };
    setGraveMaps((prev) => [...prev, newMap]);
  };

  const updateGraveMap = (id: string, updates: Partial<GraveMap>) => {
    setGraveMaps((prev) =>
      prev.map((map) => (map.id === id ? { ...map, ...updates } : map))
    );
  };

  const deleteGraveMap = (id: string) => {
    setGraveMaps((prev) => prev.filter((map) => map.id !== id));
  };

  const getGraveyardMapById = (id: string) => {
    return graveyardMaps.find((map) => map.id === id);
  };

  const getPlotMapsByGraveyard = (graveyardMapId: string) => {
    return plotMaps.filter((map) => map.graveyardMapId === graveyardMapId);
  };

  const getGraveMapsByPlot = (plotMapId: string) => {
    return graveMaps.filter((map) => map.plotMapId === plotMapId);
  };

  const value: MapContextType = {
    graveyardMaps,
    plotMaps,
    graveMaps,
    addGraveyardMap,
    updateGraveyardMap,
    deleteGraveyardMap,
    addPlotMap,
    updatePlotMap,
    deletePlotMap,
    addGraveMap,
    updateGraveMap,
    deleteGraveMap,
    getGraveyardMapById,
    getPlotMapsByGraveyard,
    getGraveMapsByPlot,
  };

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within MapProvider');
  }
  return context;
};
