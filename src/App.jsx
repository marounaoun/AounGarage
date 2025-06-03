// 📁 src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PoliciesPage from './pages/PoliciesPage';
import ClientsPage from './pages/ClientsPage';
import DebtsPage from './pages/DebtsPage';

function App() {
  return (
    <Router>
      <div className="p-4">
        <nav className="mb-6 space-x-4">
          <Link to="/" className="text-blue-600 hover:underline">Policies</Link>
          <Link to="/clients" className="text-blue-600 hover:underline">Clients</Link>
          <Link to="/debts" className="text-blue-600 hover:underline">Debts</Link>
        </nav>

        <Routes>
          <Route path="/" element={<PoliciesPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/debts" element={<DebtsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
