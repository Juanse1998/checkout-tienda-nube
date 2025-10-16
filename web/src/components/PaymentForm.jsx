import { Box, Card, Input, Button, Chip, Label, Text } from '@nimbus-ds/components';
import '@nimbus-ds/styles/dist/index.css';
import { usePaymentForm } from '../hooks/usePaymentForm';
import PaymentSuccess from './PaymentSuccess';
import PaymentError from './PaymentError';
import PaymentRejected from './PaymentRejected';
import PaymentFormHeader from './PaymentFormHeader';
import SecurityNotice from './SecurityNotice';

const PaymentForm = () => {
  const {
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
    isProcessing,
    isSuccess,
    isError,
    isRejected,
  } = usePaymentForm();

  if (isSuccess) {
    return <PaymentSuccess successData={successData} onBack={resetForm} />;
  }

  if (isRejected) {
    return <PaymentRejected errorMessage={errorMessage} onRetry={resetForm} />;
  }

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh"
      padding="4"
      style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
      }}
    >
      <Box maxWidth="550px" width="100%">
        <Card>
          <Box padding="6">
            <PaymentFormHeader />

            {isError && <PaymentError errorMessage={errorMessage} onClose={clearError} />}

            <form onSubmit={handleSubmit}>
              <Box marginBottom="3">
                <Label htmlFor="cardNumber">Número de tarjeta *</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                  onBlur={() => handleBlur('cardNumber')}
                  disabled={isProcessing}
                  autoComplete="cc-number"
                  appearance={touched.cardNumber && errors.cardNumber ? 'danger' : 'neutral'}
                />
                {touched.cardNumber && errors.cardNumber && (
                  <Box marginTop="1">
                    <Text fontSize="caption" color="danger-textLow">{errors.cardNumber}</Text>
                  </Box>
                )}
                {cardBrand !== 'unknown' && (
                  <Box marginTop="2">
                    <Chip text={cardBrand.toUpperCase()} />
                  </Box>
                )}
              </Box>

              <Box display="flex" gap="3" marginBottom="3">
                <Box flex="1">
                  <Label htmlFor="expiryDate">Fecha de vencimiento *</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    onBlur={() => handleBlur('expiryDate')}
                    disabled={isProcessing}
                    autoComplete="cc-exp"
                    appearance={touched.expiryDate && errors.expiryDate ? 'danger' : 'neutral'}
                  />
                  {touched.expiryDate && errors.expiryDate && (
                    <Box marginTop="1">
                      <Text fontSize="caption" color="danger-textLow">{errors.expiryDate}</Text>
                    </Box>
                  )}
                </Box>

                <Box flex="1">
                  <Label htmlFor="cvv">CVV *</Label>
                  <Input
                    id="cvv"
                    placeholder={cardBrand === 'amex' ? '1234' : '123'}
                    value={formData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                    onBlur={() => handleBlur('cvv')}
                    type="password"
                    disabled={isProcessing}
                    autoComplete="cc-csc"
                    appearance={touched.cvv && errors.cvv ? 'danger' : 'neutral'}
                  />
                  {touched.cvv && errors.cvv && (
                    <Box marginTop="1">
                      <Text fontSize="caption" color="danger-textLow">{errors.cvv}</Text>
                    </Box>
                  )}
                </Box>
              </Box>

              <Box marginBottom="3">
                <Label htmlFor="cardholderName">Nombre del titular *</Label>
                <Input
                  id="cardholderName"
                  placeholder="JUAN PEREZ"
                  value={formData.cardholderName}
                  onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                  onBlur={() => handleBlur('cardholderName')}
                  disabled={isProcessing}
                  autoComplete="cc-name"
                  appearance={touched.cardholderName && errors.cardholderName ? 'danger' : 'neutral'}
                />
                {touched.cardholderName && errors.cardholderName && (
                  <Box marginTop="1">
                    <Text fontSize="caption" color="danger-textLow">{errors.cardholderName}</Text>
                  </Box>
                )}
              </Box>

              <Box marginBottom="3">
                <Label htmlFor="dni">DNI *</Label>
                <Input
                  id="dni"
                  placeholder="12.345.678"
                  value={formData.dni}
                  onChange={(e) => handleInputChange('dni', e.target.value)}
                  onBlur={() => handleBlur('dni')}
                  disabled={isProcessing}
                  appearance={touched.dni && errors.dni ? 'danger' : 'neutral'}
                />
                {touched.dni && errors.dni && (
                  <Box marginTop="1">
                    <Text fontSize="caption" color="danger-textLow">{errors.dni}</Text>
                  </Box>
                )}
              </Box>

              <Box marginTop="4">
                <Button
                  type="submit"
                  appearance="primary"
                  disabled={isProcessing}
                  fullWidth
                >
                  {isProcessing ? 'Procesando...' : 'Pagar'}
                </Button>
              </Box>
            </form>

            <SecurityNotice />
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default PaymentForm;
