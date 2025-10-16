export interface FormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  dni: string;
}

export interface FormErrors {
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
  dni?: string;
}

export interface FormTouched {
  cardNumber?: boolean;
  expiryDate?: boolean;
  cvv?: boolean;
  cardholderName?: boolean;
  dni?: boolean;
}

export type FormState = 'idle' | 'validating' | 'processing' | 'success' | 'error' | 'rejected';

export interface CardBrand {
  name: string;
  pattern: RegExp;
  cvvLength: number;
}

export interface TokenResponse {
  token: string;
  last4: string;
  brand: string;
  createdAt: string;
  id: number;
}

export interface PaymentData {
  tokenId?: number;
  token?: string;
  last4?: string;
  brand?: string;
  cardholderName: string;
  dni: string;
  expiryDate?: string;
  status: 'success' | 'error';
  timestamp?: string;
  error?: string;
  metadata?: {
    userAgent: string;
    language: string;
  };
}

export interface PaymentResponse extends PaymentData {
  createdAt: string;
  id: number;
}

export interface ErrorResponse {
  error: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}
