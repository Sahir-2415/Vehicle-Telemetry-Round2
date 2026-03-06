import { useState, useEffect, useMemo } from 'react';
import { storageUtils } from '../utils/storage';
// import { TelemetryData, TelemetryStats } from '../types/telemetry';
import type { TelemetryData,TelemetryStats } from '../types/telemetry';
import { Search, Trash2, RefreshCw, Car, Gauge, Thermometer, Battery, AlertCircle } from 'lucide-react';

export default function ViewTelemetry() {
  const [telemetryData, setTelemetryData] = useState<TelemetryData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = storageUtils.getAllTelemetry();
    setTelemetryData(data);
  };

  const stats = useMemo((): TelemetryStats => {
    if (telemetryData.length === 0) {
      return {
        totalVehicles: 0,
        averageSpeed: 0,
        averageTemperature: 0,
        averageBattery: 0,
      };
    }

    const uniqueVehicles = new Set(telemetryData.map(d => d.vehicleId)).size;
    const avgSpeed = telemetryData.reduce((sum, d) => sum + d.speed, 0) / telemetryData.length;
    const avgTemp = telemetryData.reduce((sum, d) => sum + d.temperature, 0) / telemetryData.length;
    const avgBattery = telemetryData.reduce((sum, d) => sum + d.battery, 0) / telemetryData.length;

    return {
      totalVehicles: uniqueVehicles,
      averageSpeed: Math.round(avgSpeed * 10) / 10,
      averageTemperature: Math.round(avgTemp * 10) / 10,
      averageBattery: Math.round(avgBattery * 10) / 10,
    };
  }, [telemetryData]);

  const filteredAndSortedData = useMemo(() => {
    let filtered = telemetryData;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(entry =>
        entry.vehicleId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by timestamp
    filtered = [...filtered].sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

    return filtered;
  }, [telemetryData, searchQuery, sortOrder]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      storageUtils.deleteTelemetry(id);
      loadData();
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete ALL telemetry data? This cannot be undone.')) {
      storageUtils.clearAllTelemetry();
      loadData();
    }
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Telemetry Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Vehicles</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalVehicles}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Car className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg Speed</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.averageSpeed} <span className="text-lg">km/h</span></p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Gauge className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg Temperature</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.averageTemperature} <span className="text-lg">°C</span></p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Thermometer className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg Battery</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.averageBattery} <span className="text-lg">%</span></p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Battery className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Search */}
            <div className="relative flex-1 md:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by Vehicle ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Sort {sortOrder === 'desc' ? 'Oldest' : 'Newest'}</span>
              </button>
              <button
                onClick={handleClearAll}
                disabled={telemetryData.length === 0}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition font-medium"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {filteredAndSortedData.length === 0 ? (
            <div className="text-center py-16">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Telemetry Data Found</h3>
              <p className="text-gray-500">
                {searchQuery ? 'Try adjusting your search query.' : 'Start by adding some telemetry data.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Vehicle ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Speed
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Temperature
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Battery
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Energy
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAndSortedData.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-blue-600">{entry.vehicleId}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-900">{entry.speed} km/h</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`${entry.temperature > 100 ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>
                          {entry.temperature}°C
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                entry.battery > 60 ? 'bg-green-500' : entry.battery > 30 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${entry.battery}%` }}
                            />
                          </div>
                          <span className="text-gray-900">{entry.battery}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-900">{entry.energy} kWh</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-900">{entry.location}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDateTime(entry.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="text-red-600 hover:text-red-800 transition"
                          title="Delete entry"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Results count */}
        {filteredAndSortedData.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-600">
            Showing {filteredAndSortedData.length} of {telemetryData.length} entries
          </div>
        )}
      </div>
    </div>
  );
}
