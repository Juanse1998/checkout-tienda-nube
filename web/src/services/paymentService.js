const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';


export const tokenizeCard = async (cardData) => {
  const { cardNumber, expiryDate, cvv, cardholderName, dni } = cardData;
  const last4 = cardNumber.replace(/\s/g, '').slice(-4);
  const brand = detectBrand(cardNumber);
  await new Promise(resolve => setTimeout(resolve, 1500));
  if (Math.random() < 0.1) {
    throw new Error('Error de conexión con el procesador de pagos');
  }
  const token = `tok_${generateRandomToken()}`;
  
  const tokenResponse = await fetch(`${API_URL}/tokens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token,
      last4,
      brand,
      createdAt: new Date().toISOString(),
    }),
  });
  
  if (!tokenResponse.ok) {
    const errorData = await tokenResponse.json();
    throw new Error(errorData.error || 'Error al guardar el token');
  }
  
  const tokenData = await tokenResponse.json();
  
  await fetch(`${API_URL}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tokenId: tokenData.id,
      token: tokenData.token,
      last4: tokenData.last4,
      brand: tokenData.brand,
      cardholderName,
      dni,
      expiryDate,
      status: 'success',
      timestamp: new Date().toISOString(),
      metadata: {
        userAgent: navigator.userAgent,
        language: navigator.language,
      },
    }),
  });
  
  return tokenData;
};

const detectBrand = (cardNumber) => {
  const digits = cardNumber.replace(/\s/g, '');
  
  if (/^4/.test(digits)) return 'visa';
  if (/^5[1-5]/.test(digits)) return 'mastercard';
  if (/^3[47]/.test(digits)) return 'amex';
  if (/^6(?:011|5)/.test(digits)) return 'discover';
  
  return 'unknown';
};

const generateRandomToken = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export const logPaymentError = async (errorData) => {
  try {
    await fetch(`${API_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...errorData,
        status: 'error',
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error('Error logging payment error:', error);
  }
};
