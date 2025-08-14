import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type {
  User,
  Fund,
  Transaction,
  Subscription,
  SubscriptionsResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  DepositRequest,
  DepositResponse,
  SubscribeRequest,
  SubscriptionResponse
} from '../types';

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    // Usar la URL de producción por defecto, se puede cambiar a local para desarrollo
    this.baseURL = 'https://jwnazw2b41.execute-api.us-east-1.amazonaws.com/Prod';
    // Para desarrollo local, descomenta la siguiente línea:
    // this.baseURL = 'http://localhost:8000';
    
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para agregar el token de autenticación automáticamente
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para manejar respuestas y errores
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expirado o inválido
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Métodos de autenticación
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', credentials);
    if (response.data.access_token) {
      localStorage.setItem('authToken', response.data.access_token);
    }
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/register', userData);
    if (response.data.access_token) {
      localStorage.setItem('authToken', response.data.access_token);
    }
    return response.data;
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }

  // Métodos de usuario
  async getUserInfo(): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get('/users/me');
    const userData = response.data;
    
    // Corrección temporal: Si el balance parece estar multiplicado por 10
    if (userData.balance && userData.balance > 1000000 && userData.balance % 10 === 0) {
      userData.balance = userData.balance / 10;
    }
    
    return userData;
  }

  async depositMoney(depositData: DepositRequest): Promise<DepositResponse> {
    const response: AxiosResponse<DepositResponse> = await this.api.post('/users/me/deposit', depositData);
    const depositResponse = response.data;
    
    // Corrección temporal para valores de balance que parecen estar multiplicados por 10
    if (depositResponse.new_balance && depositResponse.new_balance > 1000000 && depositResponse.new_balance % 10 === 0) {
      depositResponse.new_balance = depositResponse.new_balance / 10;
    }
    if (depositResponse.previous_balance && depositResponse.previous_balance > 1000000 && depositResponse.previous_balance % 10 === 0) {
      depositResponse.previous_balance = depositResponse.previous_balance / 10;
    }
    
    return depositResponse;
  }

  async getUserTransactions(): Promise<Transaction[]> {
    const response = await this.api.get('/users/me/transactions');
    
    // La API devuelve un objeto con una propiedad 'transactions'
    const transactionsData = response.data.transactions || response.data;
    
    // Mapear los datos para que coincidan con la interfaz Transaction
    return transactionsData.map((transaction: any) => ({
      transaction_id: transaction.transaction_id,
      type: transaction.transaction_type?.toUpperCase() || transaction.type?.toUpperCase(),
      amount: transaction.amount,
      fund_id: transaction.fund_id,
      fund_name: transaction.fund_name,
      timestamp: transaction.timestamp,
      status: transaction.status,
      description: transaction.description || this.getTransactionDescription(transaction)
    }));
  }

  private getTransactionDescription(transaction: any): string {
    const type = transaction.transaction_type || transaction.type;
    switch (type?.toLowerCase()) {
      case 'subscription':
        return `Inversión en fondo ${transaction.fund_id}`;
      case 'cancellation':
        return `Cancelación de inversión en fondo ${transaction.fund_id}`;
      case 'deposit':
        return 'Depósito de dinero';
      default:
        return 'Transacción';
    }
  }

  async getUserSubscriptions(): Promise<Subscription[]> {
    const response: AxiosResponse<SubscriptionsResponse> = await this.api.get('/users/me/subscriptions');
    return response.data.active_subscriptions || [];
  }

  // Métodos de fondos
  async getFunds(): Promise<Fund[]> {
    const response: AxiosResponse<Fund[]> = await this.api.get('/funds');
    return response.data;
  }

  async subscribeToFund(subscriptionData: SubscribeRequest): Promise<SubscriptionResponse> {
    const response: AxiosResponse<SubscriptionResponse> = await this.api.post('/funds/subscribe', subscriptionData);
    return response.data;
  }

  async cancelSubscription(subscriptionId: string): Promise<{ message: string }> {
    const response: AxiosResponse<{ message: string }> = await this.api.delete(`/funds/subscriptions/${subscriptionId}`);
    return response.data;
  }

  // Métodos de utilidad
  async healthCheck(): Promise<{ status: string }> {
    const response: AxiosResponse<{ status: string }> = await this.api.get('/health');
    return response.data;
  }

  async getApiInfo(): Promise<any> {
    const response: AxiosResponse<any> = await this.api.get('/info');
    return response.data;
  }

  async initializeFunds(): Promise<{ message: string; funds_created: Fund[] }> {
    const response: AxiosResponse<{ message: string; funds_created: Fund[] }> = await this.api.post('/init-funds');
    return response.data;
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Método para obtener el token actual
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}

// Exportar una instancia singleton del servicio
export const apiService = new ApiService();
export default apiService;