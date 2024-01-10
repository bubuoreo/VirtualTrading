import React, { useEffect, useState } from 'react';

const CryptoInfo = ({ cryptoSymbol }) => {
  const [cryptoInfo, setCryptoInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/finance/${cryptoSymbol}`);
        const data = await response.json();
        setCryptoInfo(data);
      } catch (error) {
        console.error('Error loading crypto info:', error);
      }
    };

    fetchData();
  }, [cryptoSymbol]);

  if (!cryptoInfo) {
    return <div>Loading...</div>;
  }
  console.log(cryptoInfo)
  return (
    <div>
      <h2> ({cryptoInfo.symbol})</h2>
      <img src={cryptoInfo.coinImageUrl}></img>
      <p>{cryptoInfo.shortName}</p>
      <p>Price: {cryptoInfo.regularMarketPrice.toLocaleString()}</p>
      <p>Market Cap: {cryptoInfo.marketCap.toLocaleString()}</p>
      <p>Volume 24h: {cryptoInfo.volume24Hr.toLocaleString()}</p>
      <p>Circulate supply: {cryptoInfo.circulatingSupply.toLocaleString()}</p>
      {/* Ajoutez d'autres informations pertinentes */}
    </div>
  );
};

export default CryptoInfo;
