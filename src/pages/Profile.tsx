import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import { FaUser, FaEnvelope, FaDollarSign, FaCalendarAlt, FaEdit, FaSave, FaTimes, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import './Profile.css';

const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    notifications_enabled: user?.notifications_enabled || false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setError('El email es requerido');
      return false;
    }
    
    if (!formData.email.includes('@')) {
      setError('Por favor ingresa un email válido');
      return false;
    }
    
    if (formData.phone && !/^\+?[0-9\s-()]{10,}$/.test(formData.phone)) {
      setError('Por favor ingresa un número de teléfono válido');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      // Aquí iría la llamada a la API para actualizar el perfil
      // await apiService.updateProfile(formData);
      
      // Simulamos la actualización exitosa
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessMessage('✅ Perfil actualizado exitosamente');
      setIsEditing(false);
      
      // Refrescar información del usuario
      await refreshUser();
      
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Error al actualizar el perfil. Inténtalo de nuevo.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      email: user?.email || '',
      phone: user?.phone || '',
      notifications_enabled: user?.notifications_enabled || false
    });
    setIsEditing(false);
    setError('');
    setSuccessMessage('');
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

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="avatar-icon">👤</span>
          </div>
          <div className="profile-title">
            <h1><FaUser /> Mi Perfil</h1>
            <p>Gestiona tu información personal y preferencias</p>
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
          </div>
        )}

        <div className="profile-content">
          <div className="profile-section">
            <div className="section-header">
              <h2><FaUser /> Información Personal</h2>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="edit-btn"
                >
                  <FaEdit /> Editar
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                  <label htmlFor="email"><FaEnvelope /> Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">📱 Teléfono</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="+57 300 123 4567"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="notifications_enabled"
                      checked={formData.notifications_enabled}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                    <span className="checkbox-custom"></span>
                    🔔 Recibir notificaciones por email/SMS
                  </label>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="cancel-btn"
                    disabled={isLoading}
                  >
                    <FaTimes /> Cancelar
                  </button>
                  <button
                    type="submit"
                    className="save-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="loading-spinner"></span>
                        Guardando...
                      </>
                    ) : (
                      <><FaSave /> Guardar Cambios</>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-row">
                  <span className="info-label"><FaEnvelope /> Email:</span>
                  <span className="info-value">{user?.email}</span>
                </div>
                
                <div className="info-row">
                  <span className="info-label">📱 Teléfono:</span>
                  <span className="info-value">
                    {user?.phone || 'No especificado'}
                  </span>
                </div>
                
                <div className="info-row">
                  <span className="info-label">🔔 Notificaciones:</span>
                  <span className={`info-value ${user?.notifications_enabled ? 'enabled' : 'disabled'}`}>
                    {user?.notifications_enabled ? '✅ Habilitadas' : '❌ Deshabilitadas'}
                  </span>
                </div>
                
                <div className="info-row">
                  <span className="info-label"><FaCalendarAlt /> Miembro desde:</span>
                  <span className="info-value">
                    {user?.created_at ? formatDate(user.created_at) : 'No disponible'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="profile-section">
            <div className="section-header">
              <h2><FaDollarSign /> Información Financiera</h2>
            </div>
            
            <div className="financial-info">
              <div className="financial-card">
                <div className="financial-icon">💳</div>
                <div className="financial-content">
                  <h3>Saldo Disponible</h3>
                  <p className="financial-amount">
                    ${user?.balance?.toLocaleString('es-CO')} COP
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <div className="section-header">
              <h2>🔐 Seguridad</h2>
            </div>
            
            <div className="security-info">
              <div className="security-item">
                <div className="security-icon">🔒</div>
                <div className="security-content">
                  <h3>Contraseña</h3>
                  <p>Tu contraseña está protegida y encriptada</p>
                  <button className="security-btn">
                    🔄 Cambiar Contraseña
                  </button>
                </div>
              </div>
              
              <div className="security-item">
                <div className="security-icon">🛡️</div>
                <div className="security-content">
                  <h3>Autenticación</h3>
                  <p>Tu cuenta está protegida con JWT tokens</p>
                  <span className="security-status active">✅ Activa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;