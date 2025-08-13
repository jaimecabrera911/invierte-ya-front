import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  if (!isAuthenticated) {
    return (
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            📈 Invierte Ya
          </Link>
          <div className="nav-menu">
            <Link to="/login" className={isActive('/login')}>
              Iniciar Sesión
            </Link>
            <Link to="/register" className={isActive('/register')}>
              Registrarse
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/dashboard" className="nav-logo">
          📈 Invierte Ya
        </Link>
        <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link to="/dashboard" className={isActive('/dashboard')} onClick={closeMobileMenu}>
            Dashboard
          </Link>
          <Link to="/funds" className={isActive('/funds')} onClick={closeMobileMenu}>
            Fondos
          </Link>
          <Link to="/portfolio" className={isActive('/portfolio')} onClick={closeMobileMenu}>
            Mi Portafolio
          </Link>
          <Link to="/transactions" className={isActive('/transactions')} onClick={closeMobileMenu}>
            Transacciones
          </Link>
          <Link to="/profile" className={isActive('/profile')} onClick={closeMobileMenu}>
            Perfil
          </Link>
        </div>
        <div className="nav-user">
          <span className="user-info">
            👤 {user?.email}
          </span>
          <span className="user-balance">
            💰 ${user?.balance?.toLocaleString('es-CO')} COP
          </span>
          <button onClick={handleLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
        <button className="menu-toggle" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;