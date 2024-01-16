import React from 'react';
import { useParams } from 'react-router-dom';
import CryptoCourbe from '../components/Crypto/CryptoCourbe';
import CryptoInfo from '../components/Crypto/CryptoInfo';
import FormAction from '../components/Form/FormAction';
import { Header } from '../components/Header/Header.jsx';
import { Flex } from "@chakra-ui/react";


const CryptoDetailsPage = ({socket}) => {
  const { cryptoSymbol } = useParams();


  return (
    <div>
      <Header />
      <div className="bg-gray-200 min-h-screen">
        <div className="container mx-auto">
          {/* CryptoCourbe prend toute la largeur */}
          <div>
            <CryptoCourbe cryptoSymbol={cryptoSymbol} socket={socket} />
          </div>

          <div className="flex">
            {/* CryptoInfo à gauche */}
            <div className="flex-1">
              <CryptoInfo cryptoSymbol={cryptoSymbol} />
            </div>
            {/* FormAction à droite */}
            <Flex align="center" justify="center">
              <div><FormAction cryptoSymbol={cryptoSymbol} type="BUY" /></div>
              <FormAction cryptoSymbol={cryptoSymbol} type="SELL" />
            </Flex>
          </div>
        </div>
      </div>
    </div>

  );
};

export default CryptoDetailsPage;
