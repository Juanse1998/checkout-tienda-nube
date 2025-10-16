import { Box, Alert, Icon } from '@nimbus-ds/components';
import { ExclamationCircleIcon } from '@nimbus-ds/icons';

interface PaymentErrorProps {
  errorMessage: string;
  onClose: () => void;
}

const PaymentError = ({ errorMessage, onClose }: PaymentErrorProps) => {
  return (
    <Box marginBottom="4">
      <Alert appearance="danger" onRemove={onClose}>
        <Box display="flex" alignItems="center" gap="2">
          <Icon source={<ExclamationCircleIcon />} color="danger-textHigh" />
          <Box flex="1">
            {errorMessage}
          </Box>
        </Box>
      </Alert>
    </Box>
  );
};

export default PaymentError;
