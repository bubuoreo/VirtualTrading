import React from 'react';
import { useParams } from 'react-router-dom';
import CryptoCourbe from '../components/Crypto/CryptoCourbe';
import CryptoInfo from '../components/Crypto/CryptoInfo';

const CryptoDetailsPage = () => {
  const { cryptoSymbol } = useParams();

  return (
    <div className="bg-gray-200 min-h-screen">
      <div className="container mx-auto">
        <div>
          <CryptoCourbe cryptoSymbol={cryptoSymbol} />
        </div>
        <div>
          <CryptoInfo cryptoSymbol={cryptoSymbol} />
        </div>
      </div>
    </div>
  );
};

export default CryptoDetailsPage;
