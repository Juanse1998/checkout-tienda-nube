import { Box, Title, Text } from '@nimbus-ds/components';

const PaymentFormHeader = () => {
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center" 
      gap="2"
      marginBottom="4"
      textAlign="center"
    >
      <Title as="h1">Formulario de Pago</Title>
      <Text color="neutral-textLow">
        Ingresa los datos de tu tarjeta de forma segura
      </Text>
    </Box>
  );
};

export default PaymentFormHeader;
