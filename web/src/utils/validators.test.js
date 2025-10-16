/**
 * Tests para validadores
 * Para ejecutar: npm install --save-dev vitest
 * Luego: npm run test
 */

import { describe, it, expect } from 'vitest';
import {
  validateLuhn,
  detectCardBrand,
  validateExpiryDate,
  validateCVV,
  validateDNI,
  validateCardholderName,
  formatCardNumber,
  formatExpiryDate,
  formatDNI,
} from './validators';

describe('validateLuhn', () => {
  it('valida tarjetas Visa correctas', () => {
    expect(validateLuhn('4532148803436467')).toBe(true);
    expect(validateLuhn('4532 1488 0343 6467')).toBe(true);
  });

  it('valida tarjetas Mastercard correctas', () => {
    expect(validateLuhn('5425233430109903')).toBe(true);
  });

  it('rechaza números inválidos', () => {
    expect(validateLuhn('1234567890123456')).toBe(false);
    expect(validateLuhn('4532148803436468')).toBe(false);
  });

  it('rechaza números con letras', () => {
    expect(validateLuhn('4532ABC803436467')).toBe(false);
  });
});

describe('detectCardBrand', () => {
  it('detecta Visa', () => {
    expect(detectCardBrand('4532148803436467')).toBe('visa');
  });

  it('detecta Mastercard', () => {
    expect(detectCardBrand('5425233430109903')).toBe('mastercard');
  });

  it('detecta Amex', () => {
    expect(detectCardBrand('378282246310005')).toBe('amex');
  });

  it('detecta Discover', () => {
    expect(detectCardBrand('6011111111111117')).toBe('discover');
  });

  it('retorna unknown para tarjetas no reconocidas', () => {
    expect(detectCardBrand('9999999999999999')).toBe('unknown');
  });
});

describe('validateExpiryDate', () => {
  it('acepta fechas futuras válidas', () => {
    const result = validateExpiryDate('12/25');
    expect(result.valid).toBe(true);
  });

  it('rechaza fechas vencidas', () => {
    const result = validateExpiryDate('01/20');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Tarjeta vencida');
  });

  it('rechaza meses inválidos', () => {
    const result = validateExpiryDate('13/25');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Mes inválido');
  });

  it('rechaza formatos incorrectos', () => {
    const result = validateExpiryDate('1225');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Formato inválido. Use MM/YY');
  });
});

describe('validateCVV', () => {
  it('acepta CVV de 3 dígitos para Visa', () => {
    const result = validateCVV('123', 'visa');
    expect(result.valid).toBe(true);
  });

  it('acepta CVV de 4 dígitos para Amex', () => {
    const result = validateCVV('1234', 'amex');
    expect(result.valid).toBe(true);
  });

  it('rechaza CVV con longitud incorrecta', () => {
    const result = validateCVV('12', 'visa');
    expect(result.valid).toBe(false);
  });

  it('rechaza CVV con letras', () => {
    const result = validateCVV('12A', 'visa');
    expect(result.valid).toBe(false);
  });
});

describe('validateDNI', () => {
  it('acepta DNI de 8 dígitos', () => {
    const result = validateDNI('12345678');
    expect(result.valid).toBe(true);
  });

  it('acepta DNI de 7 dígitos', () => {
    const result = validateDNI('1234567');
    expect(result.valid).toBe(true);
  });

  it('acepta DNI con puntos', () => {
    const result = validateDNI('12.345.678');
    expect(result.valid).toBe(true);
  });

  it('rechaza DNI con menos de 7 dígitos', () => {
    const result = validateDNI('123456');
    expect(result.valid).toBe(false);
  });

  it('rechaza DNI con más de 8 dígitos', () => {
    const result = validateDNI('123456789');
    expect(result.valid).toBe(false);
  });
});

describe('validateCardholderName', () => {
  it('acepta nombres válidos', () => {
    const result = validateCardholderName('JUAN PEREZ');
    expect(result.valid).toBe(true);
  });

  it('acepta nombres con acentos', () => {
    const result = validateCardholderName('JOSÉ GARCÍA');
    expect(result.valid).toBe(true);
  });

  it('rechaza nombres muy cortos', () => {
    const result = validateCardholderName('AB');
    expect(result.valid).toBe(false);
  });

  it('rechaza nombres con números', () => {
    const result = validateCardholderName('JUAN123');
    expect(result.valid).toBe(false);
  });
});

describe('formatCardNumber', () => {
  it('formatea número de tarjeta con espacios', () => {
    expect(formatCardNumber('4532148803436467')).toBe('4532 1488 0343 6467');
  });

  it('mantiene formato si ya tiene espacios', () => {
    expect(formatCardNumber('4532 1488 0343 6467')).toBe('4532 1488 0343 6467');
  });
});

describe('formatExpiryDate', () => {
  it('formatea fecha de vencimiento', () => {
    expect(formatExpiryDate('1225')).toBe('12/25');
  });

  it('maneja entrada parcial', () => {
    expect(formatExpiryDate('12')).toBe('12');
  });
});

describe('formatDNI', () => {
  it('formatea DNI de 8 dígitos', () => {
    expect(formatDNI('12345678')).toBe('12.345.678');
  });

  it('formatea DNI de 7 dígitos', () => {
    expect(formatDNI('1234567')).toBe('1.234.567');
  });

  it('maneja entrada parcial', () => {
    expect(formatDNI('12345')).toBe('12345');
  });
});
