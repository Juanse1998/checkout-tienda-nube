import { useState } from 'react';
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

const FORM_STATES = {
  IDLE: 'idle',
  VALIDATING: 'validating',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  ERROR: 'error',
  REJECTED: 'rejected',
};

export const usePaymentForm = () => {
  const [formState, setFormState] = useState(FORM_STATES.IDLE);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    dni: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successData, setSuccessData] = useState(null);

  const cardBrand = detectCardBrand(formData.cardNumber);

  const handleInputChange = (field, value) => {
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

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const validateField = (field, value) => {
    let error = null;

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
          if (!validation.valid) {
            error = validation.message;
          }
        }
        break;

      case 'cvv':
        if (!value) {
          error = 'CVV requerido';
        } else {
          const validation = validateCVV(value, cardBrand);
          if (!validation.valid) {
            error = validation.message;
          }
        }
        break;

      case 'cardholderName':
        if (!value) {
          error = 'Nombre del titular requerido';
        } else {
          const validation = validateCardholderName(value);
          if (!validation.valid) {
            error = validation.message;
          }
        }
        break;

      case 'dni':
        if (!value) {
          error = 'DNI requerido';
        } else {
          const validation = validateDNI(value);
          if (!validation.valid) {
            error = validation.message;
          }
        }
        break;

      default:
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return error === null;
  };

  const validateAllFields = () => {
    const fields = ['cardNumber', 'expiryDate', 'cvv', 'cardholderName', 'dni'];
    let isValid = true;

    fields.forEach(field => {
      const fieldValid = validateField(field, formData[field]);
      if (!fieldValid) {
        isValid = false;
      }
    });

    const allTouched = fields.reduce((acc, field) => ({ ...acc, [field]: true }), {});
    setTouched(allTouched);

    return isValid;
  };

  const handleSubmit = async (e) => {
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
        error: error.message,
      });

      const isRejected = error.message.toLowerCase().includes('rechazado') || 
                        error.message.toLowerCase().includes('rejected');
      
      if (isRejected) {
        setFormState(FORM_STATES.REJECTED);
      } else {
        setFormState(FORM_STATES.ERROR);
      }
      
      setErrorMessage(error.message || 'Error al procesar el pago');
    }
  };

  const resetForm = () => {
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

  const clearError = () => {
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
