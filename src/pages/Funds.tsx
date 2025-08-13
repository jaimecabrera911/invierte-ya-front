import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import { Fund, SubscribeRequest } from '../types';
import { FaChartLine, FaExclamationTriangle, FaDollarSign, FaPercentage, FaCalendarAlt, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import './Funds.css';

const Funds: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [funds, setFunds] = useState<Fund[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [subscribingTo, setSubscribingTo] = useState<string | null>(null);
  const [subscriptionAmounts, setSubscriptionAmounts] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadFunds();
  }, []);

  const loadFunds = async () => {
    try {
      setIsLoading(true);
      setError('');
      const fundsData = await apiService.getFunds();
      setFunds(fundsData.filter(fund => fund.is_active));
    } catch (err: any) {
      setError('Error al cargar los fondos');
      console.error('Error loading funds:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmountChange = (fundId: string, amount: string) => {
    setSubscriptionAmounts(prev => ({
      ...prev,
      [fundId]: amount
    }));
  };

  const handleSubscribe = async (fund: Fund) => {
    if (!user) return;

    const customAmount = subscriptionAmounts[fund.fund_id];
    const amount = customAmount ? parseInt(customAmount.replace(/[^0-9]/g, '')) : fund.minimum_amount;

    if (amount < fund.minimum_amount) {
      setError(`El monto mínimo para ${fund.name} es $${fund.minimum_amount.toLocaleString('es-CO')} COP`);
      return;
    }

    if (amount > user.balance) {
      setError('No tienes suficiente saldo para esta inversión');
      return;
    }

    try {
      setSubscribingTo(fund.fund_id);
      setError('');
      setSuccessMessage('');

      const subscriptionData: SubscribeRequest = {
        fund_id: fund.fund_id,
        amount: amount
      };

      await apiService.subscribeToFund(subscriptionData);
      setSuccessMessage(`¡Suscripción exitosa a ${fund.name}!`);
      
      // Refrescar información del usuario
      await refreshUser();
      
      // Limpiar el monto personalizado
      setSubscriptionAmounts(prev => {
        const newAmounts = { ...prev };
        delete newAmounts[fund.fund_id];
        return newAmounts;
      });

      // Limpiar mensaje después de 5 segundos
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        'Error al suscribirse al fondo'
      );
    } finally {
      setSubscribingTo(null);
    }
  };

  const formatCurrency = (amount: string) => {
    const numericValue = amount.replace(/[^0-9]/g, '');
    if (!numericValue) return '';
    return parseInt(numericValue).toLocaleString('es-CO');
  };

  const handleAmountInputChange = (fundId: string, value: string) => {
    const formatted = formatCurrency(value);
    handleAmountChange(fundId, formatted);
  };

  if (isLoading) {
    return (
      <div className="funds-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando fondos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="funds-container">
      <div className="funds-header">
        <h1><FaChartLine /> Fondos de Inversión</h1>
        <p>Explora y suscríbete a nuestros fondos de inversión</p>
        <div className="user-balance">
          <FaDollarSign /> Saldo disponible: <strong>${user?.balance?.toLocaleString('es-CO')} COP</strong>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <FaExclamationTriangle /> {error}
          <button onClick={() => setError('')} className="close-btn">×</button>
        </div>
      )}

      {successMessage && (
        <div className="success-message">
          <FaCheckCircle /> {successMessage}
          <button onClick={() => setSuccessMessage('')} className="close-btn">×</button>
        </div>
      )}

      <div className="funds-grid">
        {funds.length > 0 ? (
          funds.map((fund) => {
            const customAmount = subscriptionAmounts[fund.fund_id] || '';
            const amount = customAmount ? parseInt(customAmount.replace(/[^0-9]/g, '')) : fund.minimum_amount;
            const canAfford = user ? amount <= user.balance : false;
            const isValidAmount = amount >= fund.minimum_amount;
            
            return (
              <div key={fund.fund_id} className="fund-card">
                <div className="fund-header">
                  <h2>{fund.name}</h2>
                  <span className={`fund-category ${fund.category.toLowerCase()}`}>
                    {fund.category}
                  </span>
                </div>

                <div className="fund-details">
                  <div className="fund-info-item">
                    <span className="label">Categoría:</span>
                    <span className="value">
                      {fund.category === 'FPV' ? 'Fondo de Pensiones Voluntarias' : 'Fondo de Inversión Colectiva'}
                    </span>
                  </div>
                  
                  <div className="fund-info-item">
                    <span className="label">Inversión mínima:</span>
                    <span className="value minimum-amount">
                      ${fund.minimum_amount.toLocaleString('es-CO')} COP
                    </span>
                  </div>

                  <div className="fund-description">
                    {fund.category === 'FPV' ? (
                      <p><FaPercentage /> Ideal para ahorrar para tu pensión con beneficios tributarios.</p>
                    ) : (
                      <p><FaChartLine /> Diversifica tu portafolio con gestión profesional de inversiones.</p>
                    )}
                  </div>
                </div>

                <div className="subscription-section">
                  <div className="amount-input-group">
                    <label htmlFor={`amount-${fund.fund_id}`}>Monto a invertir:</label>
                    <div className="amount-input-wrapper">
                      <span className="currency-symbol">$</span>
                      <input
                        type="text"
                        id={`amount-${fund.fund_id}`}
                        value={customAmount}
                        onChange={(e) => handleAmountInputChange(fund.fund_id, e.target.value)}
                        placeholder={fund.minimum_amount.toLocaleString('es-CO')}
                        className="amount-input"
                        disabled={subscribingTo === fund.fund_id}
                      />
                      <span className="currency-label">COP</span>
                    </div>
                    {!isValidAmount && customAmount && (
                      <span className="validation-error">
                        Monto mínimo: ${fund.minimum_amount.toLocaleString('es-CO')}
                      </span>
                    )}
                    {!canAfford && isValidAmount && (
                      <span className="validation-error">
                        Saldo insuficiente
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleSubscribe(fund)}
                    disabled={subscribingTo === fund.fund_id || !canAfford || !isValidAmount}
                    className={`subscribe-btn ${
                      canAfford && isValidAmount ? 'enabled' : 'disabled'
                    }`}
                  >
                    {subscribingTo === fund.fund_id ? (
                      <>
                        <FaSpinner className="spinning" />
                        Suscribiendo...
                      </>
                    ) : (
                      <><FaDollarSign /> Invertir ${amount.toLocaleString('es-CO')}</>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-funds">
            <h2><FaExclamationTriangle /> No hay fondos disponibles</h2>
            <p>Actualmente no hay fondos activos para invertir.</p>
            <button onClick={loadFunds} className="retry-btn">
              🔄 Recargar
            </button>
          </div>
        )}
      </div>

      <div className="funds-info">
        <h2><FaChartLine /> Información sobre los Fondos</h2>
        <div className="info-grid">
          <div className="info-card">
            <h3><FaPercentage /> FPV - Fondos de Pensiones Voluntarias</h3>
            <ul>
              <li>Orientados al ahorro para pensión</li>
              <li>Beneficios tributarios</li>
              <li>Inversión a largo plazo</li>
              <li>Mayor estabilidad</li>
            </ul>
          </div>
          <div className="info-card">
            <h3><FaChartLine /> FIC - Fondos de Inversión Colectiva</h3>
            <ul>
              <li>Diversificación de inversiones</li>
              <li>Gestión profesional</li>
              <li>Mayor potencial de rentabilidad</li>
              <li>Flexibilidad en plazos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Funds;