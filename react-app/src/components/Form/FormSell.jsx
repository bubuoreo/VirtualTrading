import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@chakra-ui/react';

const FormSell = ({ cryptoSymbol }) => {
  const [AssetAmount, setAssetAmount] = useState('');
  const [cryptoPrice, setCryptoPrice] = useState(null);
  const currentDate = new Date();
  const cryptoinfoData = useSelector((state) => state.cryptodataReducer.cryptoinfoData);
  const cryptoInfo = cryptoinfoData[cryptoSymbol];
  let user = useSelector(state => state.userReducer.user);

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
      <h2>Vendre des {cryptoSymbol}</h2>
      <form onSubmit={handleSubmit}>

        <label>
          Quantité de {cryptoSymbol}:
          <input
            type="number"
            value={AssetAmount}
            onChange={handleAssetAmountChange}
          />
        </label>

        <div>
          <p>Montant en USD: {calculateUSDAmount()}</p>
        </div>
        <Button type="submit">
          Vendre
        </Button>
      </form>
    </div>
  );
};

export default FormSell;
