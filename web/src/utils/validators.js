/**
 * Validación de número de tarjeta usando algoritmo de Luhn
 */
export const validateLuhn = (cardNumber) => {
  const digits = cardNumber.replace(/\s/g, '');
  
  if (!/^\d+$/.test(digits)) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

/**
 * Detecta la marca de la tarjeta basándose en el número
 */
export const detectCardBrand = (cardNumber) => {
  const digits = cardNumber.replace(/\s/g, '');
  
  if (/^4/.test(digits)) return 'visa';
  if (/^5[1-5]/.test(digits)) return 'mastercard';
  if (/^3[47]/.test(digits)) return 'amex';
  if (/^6(?:011|5)/.test(digits)) return 'discover';
  
  return 'unknown';
};

/**
 * Valida fecha de vencimiento (MM/YY)
 */
export const validateExpiryDate = (expiry) => {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  
  if (!match) {
    return { valid: false, message: 'Formato inválido. Use MM/YY' };
  }

  const month = parseInt(match[1], 10);
  const year = parseInt(match[2], 10);

  if (month < 1 || month > 12) {
    return { valid: false, message: 'Mes inválido' };
  }

  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return { valid: false, message: 'Tarjeta vencida' };
  }

  return { valid: true };
};

/**
 * Valida CVV según la marca de tarjeta
 */
export const validateCVV = (cvv, brand) => {
  const cvvLength = brand === 'amex' ? 4 : 3;
  
  if (!/^\d+$/.test(cvv)) {
    return { valid: false, message: 'Solo números' };
  }

  if (cvv.length !== cvvLength) {
    return { valid: false, message: `Debe tener ${cvvLength} dígitos` };
  }

  return { valid: true };
};

/**
 * Valida DNI argentino (7-8 dígitos)
 */
export const validateDNI = (dni) => {
  const digits = dni.replace(/\./g, '');
  
  if (!/^\d{7,8}$/.test(digits)) {
    return { valid: false, message: 'DNI debe tener 7-8 dígitos' };
  }

  return { valid: true };
};

/**
 * Valida nombre del titular
 */
export const validateCardholderName = (name) => {
  const trimmed = name.trim();
  
  if (trimmed.length < 3) {
    return { valid: false, message: 'Nombre muy corto' };
  }

  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(trimmed)) {
    return { valid: false, message: 'Solo letras y espacios' };
  }

  return { valid: true };
};

/**
 * Formatea número de tarjeta con espacios cada 4 dígitos
 */
export const formatCardNumber = (value) => {
  const digits = value.replace(/\s/g, '');
  const groups = digits.match(/.{1,4}/g);
  return groups ? groups.join(' ') : digits;
};

/**
 * Formatea fecha de vencimiento (MM/YY)
 */
export const formatExpiryDate = (value) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length >= 2) {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
  }
  return digits;
};

/**
 * Formatea DNI con puntos
 */
export const formatDNI = (value) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 6) return digits;
  if (digits.length <= 7) return `${digits.slice(0, -3)}.${digits.slice(-3)}`;
  return `${digits.slice(0, -6)}.${digits.slice(-6, -3)}.${digits.slice(-3)}`;
};
