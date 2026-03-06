import type { TelemetryData } from '../types/telemetry';

const STORAGE_KEY = 'vehicle_telemetry_data';

export const storageUtils = {
  // Get all telemetry data
  getAllTelemetry: (): TelemetryData[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  // Add new telemetry entry
  addTelemetry: (telemetry: Omit<TelemetryData, 'id'>): TelemetryData => {
    const allData = storageUtils.getAllTelemetry();
    const newEntry: TelemetryData = {
      ...telemetry,
      id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    allData.push(newEntry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
    return newEntry;
  },

  // Delete telemetry entry by id
  deleteTelemetry: (id: string): void => {
    const allData = storageUtils.getAllTelemetry();
    const filtered = allData.filter((entry) => entry.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  // Clear all telemetry data
  clearAllTelemetry: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Get telemetry by vehicle ID
  getTelemetryByVehicleId: (vehicleId: string): TelemetryData[] => {
    const allData = storageUtils.getAllTelemetry();
    return allData.filter((entry) => 
      entry.vehicleId.toLowerCase().includes(vehicleId.toLowerCase())
    );
  },
};
