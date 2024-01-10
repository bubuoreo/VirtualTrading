import React, { useState, useEffect } from 'react';

const FormAction = ({ cryptoSymbol }) => {
  const [usdAmount, setUsdAmount] = useState('');
  const [cryptoPrice, setCryptoPrice] = useState(null);

  useEffect(() => {
    // Effect pour récupérer le prix en temps réel de la crypto-monnaie sélectionnée
    const fetchCryptoPrice = async () => {
      try {
        const response = await fetch(`http://localhost:3000/finance/${cryptoSymbol}`);
        const data = await response.json();
        setCryptoPrice(data.regularMarketPrice);
      } catch (error) {
        console.error('Error loading crypto price:', error);
      }
    };

    fetchCryptoPrice();
  }, [cryptoSymbol]);

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
      <h2>Acheter des {cryptoSymbol}</h2>
      <form>
        <label>
          Montant en USD:
          <input
            type="number"
            value={usdAmount}
            onChange={handleUsdAmountChange}
          />
        </label>
      </form>
      <div>
        <p>Quantité de {cryptoSymbol}: {calculateBitcoinAmount()}</p>
      </div>
    </div>
  );
};

export default FormAction;
