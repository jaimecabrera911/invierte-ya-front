import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Funds from './pages/Funds';
import Deposit from './pages/Deposit';
import Portfolio from './pages/Portfolio';
import Profile from './pages/Profile';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
              {/* Rutas públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Rutas protegidas */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <main className="main-content">
                      <Dashboard />
                    </main>
                  </>
                </ProtectedRoute>
              } />
              
              <Route path="/funds" element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <main className="main-content">
                      <Funds />
                    </main>
                  </>
                </ProtectedRoute>
              } />
              
              <Route path="/deposit" element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <main className="main-content">
                      <Deposit />
                    </main>
                  </>
                </ProtectedRoute>
              } />
              
              <Route path="/portfolio" element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <main className="main-content">
                      <Portfolio />
                    </main>
                  </>
                </ProtectedRoute>
              } />
              
              <Route path="/transactions" element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <main className="main-content">
                      <Portfolio />
                    </main>
                  </>
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <main className="main-content">
                      <Profile />
                    </main>
                  </>
                </ProtectedRoute>
              } />
              
              {/* Ruta por defecto */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Ruta 404 */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
