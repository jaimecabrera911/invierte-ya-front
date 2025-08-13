import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import { DepositRequest } from '../types';
import { FaCreditCard, FaDollarSign, FaExclamationTriangle, FaCheckCircle, FaSpinner, FaMoneyBillWave, FaLightbulb, FaInfoCircle, FaLock, FaBolt, FaEnvelope, FaBriefcase, FaChartBar } from 'react-icons/fa';
import './Deposit.css';

const Deposit: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const MIN_DEPOSIT = 10000;
  const MAX_DEPOSIT = 10000000;

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (!numericValue) return '';
    return parseInt(numericValue).toLocaleString('es-CO');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setAmount(formatted);
    setError('');
  };

  const getNumericAmount = () => {
    return parseInt(amount.replace(/[^0-9]/g, '')) || 0;
  };

  const validateAmount = (): boolean => {
    const numericAmount = getNumericAmount();
    
    if (numericAmount < MIN_DEPOSIT) {
      setError(`El monto mínimo de depósito es $${MIN_DEPOSIT.toLocaleString('es-CO')} COP`);
      return false;
    }
    
    if (numericAmount > MAX_DEPOSIT) {
      setError(`El monto máximo de depósito es $${MAX_DEPOSIT.toLocaleString('es-CO')} COP`);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAmount()) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const depositData: DepositRequest = {
        amount: getNumericAmount()
      };
      
      const response = await apiService.depositMoney(depositData);
      
      setSuccessMessage(
        `¡Depósito exitoso! Se han agregado $${response.amount_deposited.toLocaleString('es-CO')} COP a tu cuenta.`
      );
      
      // Refrescar información del usuario
      await refreshUser();
      
      // Limpiar el formulario
      setAmount('');
      
      // Redirigir al dashboard después de 3 segundos
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        'Error al procesar el depósito. Inténtalo de nuevo.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const quickAmounts = [50000, 100000, 250000, 500000, 1000000];

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toLocaleString('es-CO'));
    setError('');
  };

  return (
    <div className="deposit-container">
      <div className="deposit-card">
        <div className="deposit-header">
          <h1><FaCreditCard /> Depositar Dinero</h1>
          <p>Agrega fondos a tu cuenta para comenzar a invertir</p>
          <div className="current-balance">
            <FaDollarSign /> Saldo actual: <strong>${user?.balance?.toLocaleString('es-CO')} COP</strong>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <FaExclamationTriangle /> {error}
          </div>
        )}

        {successMessage && (
          <div className="success-message">
            <FaCheckCircle /> {successMessage}
            <div className="redirect-info">
              Redirigiendo al dashboard en 3 segundos...
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="deposit-form">
          <div className="amount-section">
            <label htmlFor="amount"><FaMoneyBillWave /> Monto a depositar</label>
            <div className="amount-input-wrapper">
              <span className="currency-symbol">$</span>
              <input
                type="text"
                id="amount"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0"
                className="amount-input"
                disabled={isLoading}
                required
              />
              <span className="currency-label">COP</span>
            </div>
            
            <div className="amount-info">
              <div className="limits">
                <span>Mínimo: ${MIN_DEPOSIT.toLocaleString('es-CO')}</span>
                <span>Máximo: ${MAX_DEPOSIT.toLocaleString('es-CO')}</span>
              </div>
            </div>
          </div>

          <div className="quick-amounts">
            <h3><FaLightbulb /> Montos sugeridos</h3>
            <div className="quick-amounts-grid">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  type="button"
                  onClick={() => handleQuickAmount(quickAmount)}
                  className="quick-amount-btn"
                  disabled={isLoading}
                >
                  ${quickAmount.toLocaleString('es-CO')}
                </button>
              ))}
            </div>
          </div>

          <div className="deposit-summary">
            <div className="summary-row">
              <span>Monto a depositar:</span>
              <span className="amount-value">
                ${getNumericAmount().toLocaleString('es-CO')} COP
              </span>
            </div>
            <div className="summary-row">
              <span>Saldo actual:</span>
              <span>${user?.balance?.toLocaleString('es-CO')} COP</span>
            </div>
            <div className="summary-row total">
              <span>Nuevo saldo:</span>
              <span className="new-balance">
                ${((user?.balance || 0) + getNumericAmount()).toLocaleString('es-CO')} COP
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="deposit-btn"
            disabled={isLoading || !amount || getNumericAmount() < MIN_DEPOSIT}
          >
            {isLoading ? (
              <>
                <FaSpinner className="loading-spinner" />
                Procesando depósito...
              </>
            ) : (
              <><FaDollarSign /> Depositar ${getNumericAmount().toLocaleString('es-CO')} COP</>
            )}
          </button>
        </form>

        <div className="deposit-info">
          <h3><FaInfoCircle /> Información importante</h3>
          <ul>
            <li><FaLock /> Todas las transacciones son seguras y encriptadas</li>
            <li><FaBolt /> Los depósitos se procesan instantáneamente</li>
            <li><FaEnvelope /> Recibirás una confirmación por email/SMS</li>
            <li><FaBriefcase /> Los fondos estarán disponibles inmediatamente para invertir</li>
            <li><FaChartBar /> Puedes ver el historial en la sección de transacciones</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Deposit;