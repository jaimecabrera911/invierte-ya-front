// Tipos para la aplicación Invierte Ya

export interface User {
  user_id: string;
  email: string;
  phone: string;
  notification_preference: 'EMAIL' | 'SMS';
  created_at: string;
  balance: number;
}

export interface Fund {
  fund_id: string;
  name: string;
  minimum_amount: number;
  category: 'FPV' | 'FIC';
  is_active: boolean;
}

export interface Transaction {
  transaction_id: string;
  type: 'DEPOSIT' | 'SUBSCRIPTION' | 'CANCELLATION';
  amount: number;
  fund_id?: string;
  fund_name?: string;
  timestamp: string;
  status: string;
}

export interface Subscription {
  subscription_id: string;
  fund_id: string;
  fund_name: string;
  amount: number;
  subscription_date: string;
  status: 'ACTIVE' | 'CANCELLED';
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  phone: string;
  notification_preference: 'EMAIL' | 'SMS';
}

export interface DepositRequest {
  amount: number;
}

export interface SubscribeRequest {
  fund_id: string;
  amount?: number;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface DepositResponse {
  message: string;
  transaction_id: string;
  amount_deposited: number;
  previous_balance: number;
  new_balance: number;
  timestamp: string;
}

export interface SubscriptionResponse {
  message: string;
  transaction_id: string;
}