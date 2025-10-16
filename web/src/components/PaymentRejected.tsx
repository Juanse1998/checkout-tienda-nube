import { Box, Card, Title, Text, Button } from '@nimbus-ds/components';
import Lottie from 'lottie-react';
import errorAnimation from '../assets/error.json';

interface PaymentRejectedProps {
  errorMessage: string;
  onRetry: () => void;
}

const PaymentRejected = ({ errorMessage, onRetry }: PaymentRejectedProps) => {
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
                <Lottie animationData={errorAnimation} loop={true} />
              </Box>

              <Box textAlign="center" display="flex" flexDirection="column" alignItems="center" gap="2">
                <Title as="h2" color="danger-textHigh">Pago rechazado</Title>
                <Text color="neutral-textLow">
                  {errorMessage || 'Tu transacción no pudo ser procesada'}
                </Text>
              </Box>

              <Box 
                width="100%" 
                padding="4" 
                backgroundColor="danger-surface" 
                borderRadius="2"
                display="flex"
                flexDirection="column"
                gap="3"
              >
                <Text fontWeight="medium" color="danger-textHigh">
                  ¿Qué puedes hacer?
                </Text>
                
                <Box display="flex" flexDirection="column" gap="2">
                  <Text fontSize="caption">
                    • Verifica que los datos de tu tarjeta sean correctos
                  </Text>
                  <Text fontSize="caption">
                    • Asegúrate de tener fondos suficientes
                  </Text>
                  <Text fontSize="caption">
                    • Intenta con otra tarjeta
                  </Text>
                  <Text fontSize="caption">
                    • Contacta a tu banco si el problema persiste
                  </Text>
                </Box>
              </Box>

              <Box width="100%" marginTop="2">
                <Button 
                  appearance="primary" 
                  fullWidth
                  onClick={onRetry}
                >
                  Intentar nuevamente
                </Button>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default PaymentRejected;
