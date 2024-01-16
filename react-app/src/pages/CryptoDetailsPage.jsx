import React from 'react';
import { useParams } from 'react-router-dom';
import CryptoCourbe from '../components/Crypto/CryptoCourbe';
import CryptoInfo from '../components/Crypto/CryptoInfo';
import FormBuy from '../components/Form/FormBuy';
import FormSell from '../components/Form/FormSell';
import { Header } from '../components/Header/Header.jsx';
import { Flex } from "@chakra-ui/react";


const CryptoDetailsPage = () => {
  const { cryptoSymbol } = useParams();


  return (
    <div>
      <Header />
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
            <Flex align="center" justify="center">
              <div><FormBuy cryptoSymbol={cryptoSymbol}/></div>
              <FormSell cryptoSymbol={cryptoSymbol}/>
            </Flex>
          </div>
        </div>
      </div>
    </div>

  );
};

export default CryptoDetailsPage;
