import React from 'react';
import { useParams } from 'react-router-dom';
import CryptoCourbe from '../components/Crypto/CryptoCourbe';
import CryptoInfo from '../components/Crypto/CryptoInfo';
import FormAction from '../components/Form/FormAction';
import ActionButton from '../components/ActionButton/ActionButton';

const CryptoDetailsPage = () => {
  const { cryptoSymbol } = useParams();

  return (
    <div className="bg-gray-200 min-h-screen">
      <div className="container mx-auto">
        {/* CryptoCourbe prend toute la largeur */}
        <div>
          <CryptoCourbe cryptoSymbol={cryptoSymbol} />
        </div>

        <div className="flex">
          {/* CryptoInfo à gauche */}
          <div className="flex-1">
            <CryptoInfo cryptoSymbol={cryptoSymbol} />
          </div>
          {/* FormAction à droite */}
          <div className="flex-1">
            <FormAction cryptoSymbol={cryptoSymbol} />
          </div>
        </div>

        {/* ActionButton centré en dessous */}
        <div className="flex justify-center mt-4">
          {/* Exemple d'utilisation pour le bouton "Buy" */}
          <ActionButton type="buy" />

          {/* Exemple d'utilisation pour le bouton "Sell" */}
          <ActionButton type="sell" />
        </div>
      </div>
    </div>
  );
};

export default CryptoDetailsPage;
