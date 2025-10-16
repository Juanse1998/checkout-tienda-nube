import { Box, Card, Title, Text, Chip, Button } from '@nimbus-ds/components';
import Lottie from 'lottie-react';
import successAnimation from '../assets/success.json';

const PaymentSuccess = ({ successData, onBack }) => {
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
            <Box display="flex" flexDirection="column" alignItems="center" gap="4">
              <Box width="200px" height="200px">
                <Lottie animationData={successAnimation} loop={false} />
              </Box>

              <Box textAlign="center" display="flex" flexDirection="column" alignItems="center" gap="2">
                <Title as="h2" color="success-textHigh">¡Pago exitoso!</Title>
                <Text appearance="subdued">
                  Tu transacción se ha procesado correctamente
                </Text>
              </Box>
              <Box 
                width="100%" 
                padding="4" 
                backgroundColor="success-surface" 
                borderRadius="2"
                display="flex"
                flexDirection="column"
                gap="3"
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Text fontWeight="medium">Token:</Text>
                  <Text fontSize="small" fontFamily="monospace">{successData?.token}</Text>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Text fontWeight="medium">Tarjeta:</Text>
                  <Text fontSize="small">•••• {successData?.last4}</Text>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Text fontWeight="medium">Marca:</Text>
                  <Chip text={successData?.brand?.toUpperCase()} />
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Text fontWeight="medium">Fecha:</Text>
                  <Text fontSize="small">
                    {new Date(successData?.createdAt).toLocaleString('es-AR')}
                  </Text>
                </Box>
              </Box>

              <Box width="100%" marginTop="4">
                <Button 
                  appearance="primary" 
                  fullWidth
                  onClick={onBack}
                >
                  Volver al inicio
                </Button>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default PaymentSuccess;
