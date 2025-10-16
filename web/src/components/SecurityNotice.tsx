import { Box, Text } from '@nimbus-ds/components';

const SecurityNotice = () => {
  return (
    <Box marginTop="4" padding="3" backgroundColor="neutral-surfaceHighlight" borderRadius="2">
      <Box display="flex" alignItems="center" gap="2">
        <Text>🔒</Text>
        <Text fontSize="caption">
          Tus datos están protegidos. No almacenamos información sensible de tu tarjeta.
        </Text>
      </Box>
    </Box>
  );
};

export default SecurityNotice;
