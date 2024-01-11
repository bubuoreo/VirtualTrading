import React from 'react';
import { Button } from '@chakra-ui/react';

const ActionButton = ({ type }) => {
    const isBuyAction = type === 'buy';
    const buttonText = isBuyAction ? 'Buy' : 'Sell';
    const buttonColor = isBuyAction ? 'green' : 'red';

    return (
        <Button colorScheme={buttonColor} size="sm">
            {buttonText}
        </Button>
    );
};

export default ActionButton;
