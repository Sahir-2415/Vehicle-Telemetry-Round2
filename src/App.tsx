import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AddTelemetry from './pages/AddTelemetry';
import ViewTelemetry from './pages/ViewTelemetry';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<AddTelemetry />} />
          <Route path="/view" element={<ViewTelemetry />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
