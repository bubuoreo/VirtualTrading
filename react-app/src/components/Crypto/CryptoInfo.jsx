import React from 'react';
import { useSelector } from 'react-redux';

const CryptoInfo = ({ cryptoSymbol }) => {
  const cryptoinfoData = useSelector((state) => state.cryptodataReducer.cryptoinfoData);

  // Assurez-vous que les données sont disponibles pour le symbole de la crypto-monnaie
  const cryptoInfo = cryptoinfoData[cryptoSymbol];

  if (!cryptoInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>({cryptoInfo.symbol})</h2>
      <img src={cryptoInfo.coinImageUrl} alt={cryptoInfo.shortName} />
      <p>{cryptoInfo.shortName}</p>
      <p>Price: {cryptoInfo.regularMarketPrice.toLocaleString()}</p>
      <p>Market Cap: {cryptoInfo.marketCap.toLocaleString()}</p>
      <p>Volume 24h: {cryptoInfo.volume24Hr.toLocaleString()}</p>
      <p>Circulating Supply: {cryptoInfo.circulatingSupply.toLocaleString()}</p>
      {/* Ajoutez d'autres informations pertinentes */}
    </div>
  );
};

export default CryptoInfo;
