import { Link, useLocation } from 'react-router-dom';
import { Gauge, Plus, BarChart3 } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition">
            <Gauge className="w-8 h-8" />
            <span className="text-xl font-bold">Vehicle Telemetry System</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-1">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                isActive('/')
                  ? 'bg-white/20 font-semibold'
                  : 'hover:bg-white/10'
              }`}
            >
              <Plus className="w-5 h-5" />
              <span>Add Telemetry</span>
            </Link>
            <Link
              to="/view"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                isActive('/view')
                  ? 'bg-white/20 font-semibold'
                  : 'hover:bg-white/10'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>View Data</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
