import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import { Fund, Transaction, Subscription } from '../types';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [funds, setFunds] = useState<Fund[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const [fundsData, transactionsData, subscriptionsData] = await Promise.all([
        apiService.getFunds(),
        apiService.getUserTransactions(),
        apiService.getUserSubscriptions()
      ]);
      
      setFunds(fundsData.slice(0, 3)); // Mostrar solo los primeros 3 fondos
      setRecentTransactions(transactionsData.slice(0, 5)); // Últimas 5 transacciones
      setSubscriptions(subscriptionsData);
      
      // Refrescar información del usuario
      await refreshUser();
    } catch (err: any) {
      setError('Error al cargar los datos del dashboard');
      console.error('Error loading dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const totalInvested = subscriptions.reduce((total, sub) => {
    return sub.status === 'ACTIVE' ? total + sub.amount : total;
  }, 0);

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>¡Bienvenido, {user?.email?.split('@')[0]}! 👋</h1>
        <p>Aquí tienes un resumen de tu actividad de inversión</p>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
          <button onClick={loadDashboardData} className="retry-btn">
            Reintentar
          </button>
        </div>
      )}

      <div className="dashboard-grid">
        {/* Resumen financiero */}
        <div className="dashboard-card summary-card">
          <h2>💰 Resumen Financiero</h2>
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-label">Saldo Disponible</span>
              <span className="stat-value balance">
                ${user?.balance?.toLocaleString('es-CO')} COP
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Invertido</span>
              <span className="stat-value invested">
                ${totalInvested.toLocaleString('es-CO')} COP
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Fondos Activos</span>
              <span className="stat-value funds">
                {subscriptions.filter(sub => sub.status === 'ACTIVE').length}
              </span>
            </div>
          </div>
          <div className="summary-actions">
            <Link to="/deposit" className="action-btn primary">
              💳 Depositar Dinero
            </Link>
            <Link to="/funds" className="action-btn secondary">
              📊 Ver Fondos
            </Link>
          </div>
        </div>

        {/* Fondos destacados */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>📈 Fondos Destacados</h2>
            <Link to="/funds" className="view-all-link">Ver todos</Link>
          </div>
          <div className="funds-list">
            {funds.length > 0 ? (
              funds.map((fund) => (
                <div key={fund.fund_id} className="fund-item">
                  <div className="fund-info">
                    <h3>{fund.name}</h3>
                    <span className={`fund-category ${fund.category.toLowerCase()}`}>
                      {fund.category}
                    </span>
                  </div>
                  <div className="fund-amount">
                    Mín: ${fund.minimum_amount.toLocaleString('es-CO')}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No hay fondos disponibles</p>
            )}
          </div>
        </div>

        {/* Transacciones recientes */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>📋 Transacciones Recientes</h2>
            <Link to="/transactions" className="view-all-link">Ver todas</Link>
          </div>
          <div className="transactions-list">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <div key={transaction.transaction_id} className="transaction-item">
                  <div className="transaction-info">
                    <span className={`transaction-type ${transaction.type.toLowerCase()}`}>
                      {transaction.type === 'DEPOSIT' && '💳'}
                      {transaction.type === 'SUBSCRIPTION' && '📈'}
                      {transaction.type === 'CANCELLATION' && '📉'}
                      {transaction.type}
                    </span>
                    <span className="transaction-date">
                      {new Date(transaction.timestamp).toLocaleDateString('es-CO')}
                    </span>
                  </div>
                  <div className="transaction-amount">
                    ${transaction.amount.toLocaleString('es-CO')}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No hay transacciones recientes</p>
            )}
          </div>
        </div>

        {/* Mis suscripciones */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>🎯 Mis Suscripciones</h2>
            <Link to="/portfolio" className="view-all-link">Ver portafolio</Link>
          </div>
          <div className="subscriptions-list">
            {subscriptions.filter(sub => sub.status === 'ACTIVE').length > 0 ? (
              subscriptions
                .filter(sub => sub.status === 'ACTIVE')
                .slice(0, 3)
                .map((subscription) => (
                  <div key={subscription.subscription_id} className="subscription-item">
                    <div className="subscription-info">
                      <h4>{subscription.fund_name}</h4>
                      <span className="subscription-date">
                        Desde: {new Date(subscription.subscription_date).toLocaleDateString('es-CO')}
                      </span>
                    </div>
                    <div className="subscription-amount">
                      ${subscription.amount.toLocaleString('es-CO')}
                    </div>
                  </div>
                ))
            ) : (
              <div className="no-data">
                <p>No tienes suscripciones activas</p>
                <Link to="/funds" className="action-btn secondary small">
                  Explorar Fondos
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="quick-actions">
        <h2>🚀 Acciones Rápidas</h2>
        <div className="actions-grid">
          <Link to="/deposit" className="quick-action-card">
            <div className="action-icon">💳</div>
            <h3>Depositar</h3>
            <p>Agregar dinero a tu cuenta</p>
          </Link>
          <Link to="/funds" className="quick-action-card">
            <div className="action-icon">📊</div>
            <h3>Invertir</h3>
            <p>Explorar fondos disponibles</p>
          </Link>
          <Link to="/portfolio" className="quick-action-card">
            <div className="action-icon">🎯</div>
            <h3>Portafolio</h3>
            <p>Gestionar tus inversiones</p>
          </Link>
          <Link to="/profile" className="quick-action-card">
            <div className="action-icon">⚙️</div>
            <h3>Configurar</h3>
            <p>Ajustar tu perfil</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;