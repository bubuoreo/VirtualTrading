import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';

const FormSell = ({ cryptoSymbol }) => {
  const [AssetAmount, setAssetAmount] = useState('');
  const [cryptoPrice, setCryptoPrice] = useState(null);
  const currentDate = new Date();
  const cryptoinfoData = useSelector((state) => state.cryptodataReducer.cryptoinfoData);
  const cryptoInfo = cryptoinfoData[cryptoSymbol];
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
  }, [cryptoSymbol,cryptoInfo]);


  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const body = JSON.stringify({
        dateTime: currentDate.toISOString().slice(0, 19),
        userId: user.id,
        symbol: cryptoSymbol,
        type: "SELL",
        assetPrice: cryptoPrice,
        transactionPrice: parseFloat(calculateUSDAmount()),
        assetQuantity: parseFloat(AssetAmount),
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
    } catch (error) {
      console.error('Erreur lors de la requête :', error.message);
    }
  };

  const handleAssetAmountChange = (event) => {
    const value = event.target.value;
    setAssetAmount(value);
  };



  const calculateUSDAmount = () => {
    const AssetValue = parseFloat(AssetAmount);
    if (!isNaN(AssetValue) && cryptoPrice) {
      return (AssetValue * cryptoPrice).toFixed(8); // Fixer à 8 décimales pour Bitcoin
    }
    return 0;
  };

  return (
    <div>
      <h2>Sell {cryptoSymbol}</h2>
      <form onSubmit={handleSubmit}>

        <label>
          Quantity of {cryptoSymbol}:
          <input
            type="number"
            value={AssetAmount}
            onChange={handleAssetAmountChange}
          />
        </label>

        <div>
          <p>USD Amount: {calculateUSDAmount()}</p>
        </div>
        <Button type="submit">
          Sell
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

export default FormSell;
