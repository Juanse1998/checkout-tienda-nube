import { useState, FormEvent } from 'react';
import {
  validateLuhn,
  validateExpiryDate,
  validateCVV,
  validateDNI,
  validateCardholderName,
  formatCardNumber,
  formatExpiryDate,
  formatDNI,
  detectCardBrand,
} from '../utils/validators';
import { tokenizeCard, logPaymentError } from '../services/paymentService';
import type { FormData, FormErrors, FormTouched, FormState, TokenResponse } from '../types/payment.types';

const FORM_STATES = {
  IDLE: 'idle' as const,
  VALIDATING: 'validating' as const,
  PROCESSING: 'processing' as const,
  SUCCESS: 'success' as const,
  ERROR: 'error' as const,
  REJECTED: 'rejected' as const,
};

type FieldName = keyof FormData;

interface UsePaymentFormReturn {
  formState: FormState;
  formData: FormData;
  errors: FormErrors;
  touched: FormTouched;
  errorMessage: string;
  successData: TokenResponse | null;
  cardBrand: string;
  handleInputChange: (field: FieldName, value: string) => void;
  handleBlur: (field: FieldName) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  resetForm: () => void;
  clearError: () => void;
  isProcessing: boolean;
  isSuccess: boolean;
  isError: boolean;
  isRejected: boolean;
}

export const usePaymentForm = (): UsePaymentFormReturn => {
  const [formState, setFormState] = useState<FormState>(FORM_STATES.IDLE);
  const [formData, setFormData] = useState<FormData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    dni: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successData, setSuccessData] = useState<TokenResponse | null>(null);

  const cardBrand = detectCardBrand(formData.cardNumber);

  const handleInputChange = (field: FieldName, value: string): void => {
    let formattedValue = value;

    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value.replace(/\s/g, '').slice(0, 16));
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (field === 'cvv') {
      const maxLength = cardBrand === 'amex' ? 4 : 3;
      formattedValue = value.replace(/\D/g, '').slice(0, maxLength);
    } else if (field === 'dni') {
      formattedValue = formatDNI(value);
    } else if (field === 'cardholderName') {
      formattedValue = value.toUpperCase();
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));

    if (touched[field]) {
      validateField(field, formattedValue);
    }
  };

  const handleBlur = (field: FieldName): void => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const validateField = (field: FieldName, value: string): boolean => {
    let error: string | null = null;

    switch (field) {
      case 'cardNumber':
        if (!value) {
          error = 'Número de tarjeta requerido';
        } else if (value.replace(/\s/g, '').length < 13) {
          error = 'Número de tarjeta incompleto';
        } else if (!validateLuhn(value)) {
          error = 'Número de tarjeta inválido';
        }
        break;

      case 'expiryDate':
        if (!value) {
          error = 'Fecha de vencimiento requerida';
        } else {
          const validation = validateExpiryDate(value);
          if (!validation.isValid) {
            error = validation.error || 'Fecha inválida';
          }
        }
        break;

      case 'cvv':
        if (!value) {
          error = 'CVV requerido';
        } else {
          const validation = validateCVV(value, cardBrand);
          if (!validation.isValid) {
            error = validation.error || 'CVV inválido';
          }
        }
        break;

      case 'cardholderName':
        if (!value) {
          error = 'Nombre del titular requerido';
        } else {
          const validation = validateCardholderName(value);
          if (!validation.isValid) {
            error = validation.error || 'Nombre inválido';
          }
        }
        break;

      case 'dni':
        if (!value) {
          error = 'DNI requerido';
        } else {
          const validation = validateDNI(value);
          if (!validation.isValid) {
            error = validation.error || 'DNI inválido';
          }
        }
        break;

      default:
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error || undefined }));
    return error === null;
  };

  const validateAllFields = (): boolean => {
    const fields: FieldName[] = ['cardNumber', 'expiryDate', 'cvv', 'cardholderName', 'dni'];
    let isValid = true;

    fields.forEach(field => {
      const fieldValid = validateField(field, formData[field]);
      if (!fieldValid) {
        isValid = false;
      }
    });

    const allTouched = fields.reduce((acc, field) => ({ ...acc, [field]: true }), {} as FormTouched);
    setTouched(allTouched);

    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    setFormState(FORM_STATES.VALIDATING);
    setErrorMessage('');

    const isValid = validateAllFields();

    if (!isValid) {
      setFormState(FORM_STATES.IDLE);
      return;
    }

    setFormState(FORM_STATES.PROCESSING);

    try {
      const tokenData = await tokenizeCard(formData);

      setFormState(FORM_STATES.SUCCESS);
      setSuccessData(tokenData);
    } catch (error) {
      await logPaymentError({
        cardholderName: formData.cardholderName,
        dni: formData.dni,
        error: error instanceof Error ? error.message : 'Error desconocido',
      });

      const errorMsg = error instanceof Error ? error.message : 'Error al procesar el pago';
      const isRejected = errorMsg.toLowerCase().includes('rechazado') || 
                        errorMsg.toLowerCase().includes('rejected');
      
      if (isRejected) {
        setFormState(FORM_STATES.REJECTED);
      } else {
        setFormState(FORM_STATES.ERROR);
      }
      
      setErrorMessage(errorMsg);
    }
  };

  const resetForm = (): void => {
    setFormState(FORM_STATES.IDLE);
    setFormData({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
      dni: '',
    });
    setErrors({});
    setTouched({});
    setErrorMessage('');
    setSuccessData(null);
  };

  const clearError = (): void => {
    setFormState(FORM_STATES.IDLE);
    setErrorMessage('');
  };

  return {
    formState,
    formData,
    errors,
    touched,
    errorMessage,
    successData,
    cardBrand,
    handleInputChange,
    handleBlur,
    handleSubmit,
    resetForm,
    clearError,
    isProcessing: formState === FORM_STATES.PROCESSING || formState === FORM_STATES.VALIDATING,
    isSuccess: formState === FORM_STATES.SUCCESS,
    isError: formState === FORM_STATES.ERROR,
    isRejected: formState === FORM_STATES.REJECTED,
  };
};
