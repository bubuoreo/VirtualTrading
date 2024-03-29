import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Input, FormControl,FormLabel } from '@chakra-ui/react';

const FormBuy = ({ cryptoSymbol }) => {
  const [usdAmount, setUsdAmount] = useState('');
  const [cryptoPrice, setCryptoPrice] = useState(null);
  const currentDate = new Date();
  const cryptoinfoData = useSelector((state) => state.cryptodataReducer.cryptoinfoData);
  const cryptoInfo = cryptoinfoData[cryptoSymbol];

  const navigate = useNavigate();

  let user = useSelector(state => state.userReducer.user);

  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [responseBody, setResponseBody] = useState('');

  const handleResponseModalClose = () => {
    setResponseModalOpen(false);
    setResponseBody('');
  };

  const handleResponseModalOpen = (body) => {
    setResponseBody(body);
    setResponseModalOpen(true);
  };

  useEffect(() => {
    setCryptoPrice(cryptoInfo.regularMarketPrice);
    console.log(cryptoPrice)
  }, [cryptoSymbol, cryptoInfo]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const body = JSON.stringify({
        dateTime: currentDate.toISOString().slice(0, 19),
        userId: user.id,
        symbol: cryptoSymbol,
        type: "BUY",
        assetPrice: cryptoPrice,
        transactionPrice: parseInt(usdAmount, 10),
        assetQuantity: parseFloat(calculateBitcoinAmount()),
      });
      console.log(body);
      const response = await fetch('http://localhost/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });

      if (!response.ok) {
        const data = await response.json();
        handleResponseModalOpen(JSON.stringify(data.message, null, 2));
        throw new Error(`Erreur HTTP! Statut : ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      navigate('/wallet');

    } catch (error) {
      console.error('Erreur lors de la requête :', error.message);
    }

  };

  const handleUsdAmountChange = (event) => {
    const value = event.target.value;
    setUsdAmount(value);
  };

  const calculateBitcoinAmount = () => {
    const usdValue = parseFloat(usdAmount);
    if (!isNaN(usdValue) && cryptoPrice) {
      return (usdValue / cryptoPrice).toFixed(8); // Fixer à 8 décimales pour Bitcoin
    }
    return 0;
  };

  return (
    <div>
      <h2>Buy {cryptoSymbol}</h2>
      <form onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel>USD Amount:</FormLabel>
          <Input
            type="number"
            value={usdAmount}
            onChange={handleUsdAmountChange}
            borderColor="black" // Cette ligne définit la couleur de la bordure en noir
            borderWidth="2px"   // Cette ligne définit la largeur de la bordure
          />
        </FormControl>

        <div>
          <p>Quantity of {cryptoSymbol}: {calculateBitcoinAmount()}</p>
        </div>
        <Button type="submit">
          Buy
        </Button>
      </form>
      <Modal isOpen={responseModalOpen} onClose={handleResponseModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Transaction Failed</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <pre>{responseBody}</pre>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleResponseModalClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default FormBuy;
