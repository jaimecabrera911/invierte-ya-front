import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import { Subscription, Transaction } from '../types';
import './Portfolio.css';

const Portfolio: React.FC = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'subscriptions' | 'transactions'>('subscriptions');

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const [subscriptionsData, transactionsData] = await Promise.all([
        apiService.getUserSubscriptions(),
        apiService.getUserTransactions()
      ]);
      
      setSubscriptions(subscriptionsData);
      setTransactions(transactionsData);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Error al cargar la información del portafolio'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta suscripción?')) {
      return;
    }
    
    setCancellingId(subscriptionId);
    
    try {
      await apiService.cancelSubscription(subscriptionId);
      await loadPortfolioData(); // Recargar datos
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Error al cancelar la suscripción'
      );
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalInvested = () => {
    return subscriptions
      .filter(sub => sub.status === 'active')
      .reduce((total, sub) => total + (sub.amount || 0), 0);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return '💰';
      case 'subscription': return '📈';
      case 'cancellation': return '📉';
      default: return '💳';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit': return 'transaction-positive';
      case 'subscription': return 'transaction-investment';
      case 'cancellation': return 'transaction-negative';
      default: return 'transaction-neutral';
    }
  };

  if (isLoading) {
    return (
      <div className="portfolio-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Cargando tu portafolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-container">
      <div className="portfolio-header">
        <h1>📊 Mi Portafolio</h1>
        <p>Gestiona tus inversiones y revisa tu historial financiero</p>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
          <button onClick={loadPortfolioData} className="retry-btn">
            🔄 Reintentar
          </button>
        </div>
      )}

      <div className="portfolio-summary">
        <div className="summary-card">
          <div className="summary-icon">💰</div>
          <div className="summary-content">
            <h3>Saldo Disponible</h3>
            <p className="summary-amount">${user?.balance?.toLocaleString('es-CO')} COP</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">📈</div>
          <div className="summary-content">
            <h3>Total Invertido</h3>
            <p className="summary-amount">${getTotalInvested().toLocaleString('es-CO')} COP</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">🎯</div>
          <div className="summary-content">
            <h3>Fondos Activos</h3>
            <p className="summary-amount">{subscriptions.filter(sub => sub.status === 'active').length}</p>
          </div>
        </div>
      </div>

      <div className="portfolio-tabs">
        <button 
          className={`tab-btn ${activeTab === 'subscriptions' ? 'active' : ''}`}
          onClick={() => setActiveTab('subscriptions')}
        >
          📈 Mis Inversiones ({subscriptions.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          📋 Historial ({transactions.length})
        </button>
      </div>

      {activeTab === 'subscriptions' && (
        <div className="subscriptions-section">
          {subscriptions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📈</div>
              <h3>No tienes inversiones activas</h3>
              <p>Comienza a invertir en nuestros fondos disponibles</p>
              <a href="/funds" className="cta-btn">
                🚀 Ver Fondos Disponibles
              </a>
            </div>
          ) : (
            <div className="subscriptions-grid">
              {subscriptions.map((subscription) => (
                <div key={subscription.id} className="subscription-card">
                  <div className="subscription-header">
                    <h3>{subscription.fund_name}</h3>
                    <span className={`status-badge ${subscription.status}`}>
                      {subscription.status === 'active' ? '✅ Activa' : '❌ Cancelada'}
                    </span>
                  </div>
                  
                  <div className="subscription-details">
                    <div className="detail-row">
                      <span>💰 Monto invertido:</span>
                      <span className="amount">
                        ${subscription.amount?.toLocaleString('es-CO')} COP
                      </span>
                    </div>
                    
                    <div className="detail-row">
                      <span>📅 Fecha de suscripción:</span>
                      <span>{formatDate(subscription.created_at)}</span>
                    </div>
                    
                    {subscription.status === 'active' && (
                      <div className="subscription-actions">
                        <button
                          onClick={() => handleCancelSubscription(subscription.id)}
                          className="cancel-btn"
                          disabled={cancellingId === subscription.id}
                        >
                          {cancellingId === subscription.id ? (
                            <>
                              <span className="loading-spinner small"></span>
                              Cancelando...
                            </>
                          ) : (
                            '❌ Cancelar Suscripción'
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="transactions-section">
          {transactions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No tienes transacciones registradas</h3>
              <p>Realiza tu primer depósito o inversión para ver el historial</p>
              <a href="/deposit" className="cta-btn">
                💰 Hacer Depósito
              </a>
            </div>
          ) : (
            <div className="transactions-list">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-icon">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  
                  <div className="transaction-details">
                    <div className="transaction-main">
                      <h4>{transaction.description}</h4>
                      <span className="transaction-date">
                        {formatDate(transaction.created_at)}
                      </span>
                    </div>
                    
                    <div className={`transaction-amount ${getTransactionColor(transaction.type)}`}>
                      {transaction.type === 'deposit' ? '+' : '-'}
                      ${transaction.amount.toLocaleString('es-CO')} COP
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Portfolio;