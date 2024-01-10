import React from 'react';
import { useParams } from 'react-router-dom';
import CryptoCourbe from '../components/Crypto/CryptoCourbe';
import CryptoInfo from '../components/Crypto/CryptoInfo';
import FormAction from '../components//Form/FormAction';

const CryptoDetailsPage = () => {
  const { cryptoSymbol } = useParams();

  return (
    <div className="bg-gray-200 min-h-screen">
      <div className="container mx-auto">
        <div>
          <CryptoCourbe cryptoSymbol={cryptoSymbol} />
        </div>
        <div className="flex">
          <div className="flex-1">
            <CryptoInfo cryptoSymbol={cryptoSymbol} />
          </div>
          <div className="flex-1">
            <FormAction cryptoSymbol={cryptoSymbol} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoDetailsPage;
